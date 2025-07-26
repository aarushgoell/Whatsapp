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
  console.log("🔌 A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    socket.userId = userId;
    console.log(`🛏️ User ${userId} joined room ${userId}`);
    console.log(`🛏️ Socket ${socket.id} is now in room:`, socket.rooms);
    
    // Broadcast user online status
    socket.broadcast.emit("user_online", { userId });
  });

  socket.on("send_message", async (data) => {
    const { senderId, receiverId, message } = data;
    console.log("📨 Message received:", { senderId, receiverId, message });

    try {
      console.log("💾 Attempting to save message...");
      const saved = await saveMessage(senderId, receiverId, message);
      console.log("💾 Message saved successfully:", saved);
      
      // Emit to both sender and receiver
      console.log("📤 Emitting to receiver:", receiverId.toString());
      io.to(receiverId.toString()).emit("receive_message", saved);
      console.log("📤 Emitting to sender:", senderId.toString());
      io.to(senderId.toString()).emit("receive_message", saved);
      
      // Also emit to all connected clients for debugging
      console.log("📤 Broadcasting to all clients");
      io.emit("receive_message", saved);
    } catch (error) {
      console.error("❌ Error saving message:", error);
      console.error("❌ Error details:", error.message);
    }
  });

  socket.on("typing_start", (data) => {
    const { senderId, receiverId } = data;
    io.to(receiverId.toString()).emit("user_typing", { senderId });
  });

  socket.on("typing_stop", (data) => {
    const { senderId, receiverId } = data;
    io.to(receiverId.toString()).emit("user_stopped_typing", { senderId });
  });

  socket.on("message_read", (data) => {
    const { messageId, senderId, receiverId } = data;
    console.log("👁️ Message read:", { messageId, senderId, receiverId });
    io.to(senderId.toString()).emit("message_read_receipt", { messageId, readBy: receiverId });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    if (socket.userId) {
      // Broadcast user offline status
      socket.broadcast.emit("user_offline", { userId: socket.userId });
    }
  });
});

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const userRoutes = require("./routes/user");
const { saveMessage } = require("./models/messageModel");

// Add this at the top to ensure saveMessage is available
console.log("🔧 Server setup - saveMessage function available:", typeof saveMessage);

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
