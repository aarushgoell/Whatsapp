const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const { getAllOtherUsers } = require("../models/userModel");

router.get("/users", authenticateToken, async (req, res) => {
  const currentUserId = req.user.id;

  const users = await getAllOtherUsers(currentUserId);

  if (users.error) {
    return res.status(500).json({
      error: "Failed to get users",
    });
  }

  res.status(200).json({
    users,
  });
});

module.exports = router;
