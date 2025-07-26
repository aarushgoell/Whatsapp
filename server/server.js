const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const http = require("http");

const { Server } = require("socket.io");

dotenv.config();
const app = express();

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`🛏️ User ${userId} joined room ${userId}`);
  });

  socket.on("send_message", async (data) => {
    const { senderId, receiverId, message } = data;

    const saved = await saveMessage(senderId, receiverId, message);

    io.to(receiverId.toString()).emit("receive_message", saved);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

const authRoutes = require("./routes/auth");

const messageRoutes = require("./routes/message");
const userRoutes = require("./routes/user");
const { saveMessage } = require("./models/messageModel");

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
