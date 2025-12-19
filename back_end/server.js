const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const userRoutes = require("./routes/user.routes");

const connectTomongoDB = require("./db/connectTomongodb");
const { server, app, io } = require("./sockte/socket");

const PORT = process.env.PORT || 5000;

dotenv.config();

// MIDDLEWARE
app.use(express.json()); // this is neede to read the data from body , to parse the incoming requests with JSON paylaod
app.use(cookieParser());

// used to serve static files such as html ,css images etc from the frontend
app.use(express.static(path.join(__dirname, "../front_end/dist")));

app.use("/api/auth/", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../front_end/dist/index.html"));
});
server.listen(PORT, () => {
  connectTomongoDB();
  console.log(`server is running at prot ${PORT}`);
});
 