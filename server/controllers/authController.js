const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { createUser, getUserByEmail } = require("../models/userModel");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await createUser(name, email, hashedPassword);

    if (result.error) {
      return res.status(500).json({
        error: "Failed to register user",
      });
    }

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Signup error", err);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credential" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error", err);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

module.exports = {
  signup,
  login,
};
