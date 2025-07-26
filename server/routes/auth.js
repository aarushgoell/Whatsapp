const express = require("express");

const router = express.Router();

const { signup, login } = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/some-protected", authenticateToken, (req, res) => {
  res.json({ message: "You're authorized!", user: req.user });
});

module.exports = router;
