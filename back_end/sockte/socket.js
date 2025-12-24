const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const Message = require("../model/message.model");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // { userId: socketId }
const getReceiverSocket = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // message deliverde confirmation
  socket.on("message:delivered", async ({ messageId }) => {
    try {
      if (!messageId || !userId) return;

      const message = await Message.findById(messageId);
      if (!message) return;

      // 🔒 only receiver can mark delivered
      if (message.receiverId.toString() !== userId) return;

      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        {
          $addToSet: {
            deliveredTo: {
              userId,
              deliveredAt: new Date(),
            },
          },
        },
        { new: true }
      );

      const senderSocket = getReceiverSocket(
        updatedMessage.senderId.toString()
      );

      if (senderSocket) {
        io.to(senderSocket).emit("message:delivered:update", {
          messageId: updatedMessage._id,
        });
      }
    } catch (err) {
      console.error("delivery update failed", err.message);
    }
  });

  // message read confirmation
  socket.on("message:read", async ({ messageId }) => {
    try {
      if (!messageId || !userId) return;

      const message = await Message.findById(messageId);
      if (!message) return;

      // 🔒 only receiver can mark read
      if (message.receiverId.toString() !== userId) return;

      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        {
          $addToSet: {
            readBy: {
              userId,
              readAt: new Date(),
            },
          },
        },
        { new: true }
      );

      const senderSocket = getReceiverSocket(
        updatedMessage.senderId.toString()
      );

      if (senderSocket) {
        io.to(senderSocket).emit("message:read:update", {
          messageId: updatedMessage._id,
        });
      }
    } catch (error) {
      console.error("read update failed", error.message);
    }
  });

  // online users data
  if (userId) {
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { server, app, io, getReceiverSocket };
