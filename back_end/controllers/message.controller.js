const User = require("../model/user.model");
const Message = require("../model/message.model");
const Conversation = require("../model/conversation.model");
const { getReceiverSocket } = require("../sockte/socket");
const { server, app, io } = require("../sockte/socket");

async function sendMessage(req, res) {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocket = getReceiverSocket(receiverId.toString());
    if (receiverSocket) {
      io.to(receiverSocket).emit("newMessage", newMessage);
    }

    // this will run parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage controller ", error.message);
    return res.status(500).json({ error: "internal server error!" });
  }
}

async function receiveMessage(req, res) {
  // return res.send("you are ready to get the message");
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // populate will replace the message id with actuall message

    if (!conversation) {
      return res.status(200).json([]);
    }
    const messages = conversation.messages;

    return res.status(200).json(messages);
  } catch (error) {
    console.log("error in receiverMessage controller ", error.message);
    return res.status(500).json({ error: "internal server error!" });
  }
}

async function reactToMessage(req, res) {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    if (!emoji) {
      return res.status(400).json({ msg: "Emoji required" });
    }

    const messageOfReaction = await Message.findById(messageId);
    if (!messageOfReaction) {
      return res.status(404).json({ msg: "Message not found" });
    }

    const reactions = messageOfReaction.reactions; //[{emoji,userId[]}]

    // Find requested emoji object
    let reqEmoji = reactions.find((r) => r.emoji === emoji);

    const userAlreadyReacted = reqEmoji
      ? reqEmoji.users.some((id) => id.toString() === userId.toString())
      : false;

    // Remove user from all reactions
    reactions.forEach((reaction) => {
      reaction.users = reaction.users.filter(
        (id) => id.toString() !== userId.toString()
      );
    });

    if (!userAlreadyReacted) {
      if (reqEmoji) {
        // Add user to existing emoji
        reqEmoji.users.push(userId);
      } else {
        // Create new emoji entry
        messageOfReaction.reactions.push({ emoji, users: [userId] });
      }
    }

    messageOfReaction.reactions = messageOfReaction.reactions.filter(
      (r) => r.users.length > 0
    );

    // Save changes
    await messageOfReaction.save();

    const plainReactions = messageOfReaction.reactions.map((r) => ({
      _id: r._id.toString(),
      emoji: r.emoji,
      users: r.users.map((u) => u.toString()),
    }));

    // SOCKET IO FUNCTIONALITY WILL GO HERE

    io.emit("reactionUpdated", {
      messageId: messageId.toString(),
      reactions: plainReactions,
    });
    // Return updated reactions
    res.status(200).json(plainReactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
}

module.exports = {
  sendMessage,
  receiveMessage,
  reactToMessage,
};

// participants : {$all:[senderId,receiverId]}
// Find a conversation where senderId is inside the participants array
// ✔ AND receiverId is also inside the same array

// Only if both are present → it returns the conversation.
