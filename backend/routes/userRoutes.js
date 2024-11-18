const express = require("express");
const User = require("../models/User");
const { verifyToken } = require("../config/jwtConfig");
const sendEmail = require("../utils/emailService");

const router = express.Router();

// Lấy thông tin cá nhân của chính mình
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -resetPasswordToken -resetPasswordExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.put("/profile", async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { username, email }, { new: true });
  res.json(user);
});

module.exports = router;