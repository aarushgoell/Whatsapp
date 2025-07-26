const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  saveMessage,
  getMessagesBetweenUsers,
} = require("../models/messageModel");

router.post("/", authenticateToken, async (req, res) => {
  const senderId = req.user.id;

  const { receiverId, message } = req.body;

  if (!receiverId || !message) {
    return res.status(400).json({
      error: "receiverId and message required",
    });
  }

  const result = await saveMessage(senderId, receiverId, message);

  if (result.error) {
    return res.status(500).json({
      error: "Failed to send message",
    });
  }

  res.status(201).json({
    message: "Message sent",
    data: result,
  });
});

router.get("/:userId", authenticateToken, async (req, res) => {
  const user1 = req.user.id;

  const user2 = req.params.userId;

  const message = await getMessagesBetweenUsers(user1, user2);

  if (message.error) {
    return res.status(500).json({
      error: "failed to load chat",
    });
  }

  res.status(200).json({
    message,
  });
});

module.exports = router;
