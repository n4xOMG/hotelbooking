const express = require("express");
const User = require("../models/User");
const { verifyToken } = require("../config/jwtConfig");
const sendEmail = require("../utils/emailService");

const router = express.Router();

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

router.put("/profile", verifyToken, async (req, res) => {
  const { username, firstname, lastname, phoneNumber, avatarUrl } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { username, firstname, lastname, phoneNumber, avatarUrl }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.post("/send-verification-email", verifyToken, async (req, res) => {
  const { newEmail } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const verificationToken = user.generateVerificationToken();
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${newEmail}`;
  user.emailVerificationToken = verificationToken;
  try {
    await user.save();
    await sendEmail(newEmail, "Email Verification", `Please verify your email by clicking the following link: ${verificationLink}`);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.post("/verify-email", async (req, res) => {
  const { token, email } = req.body;

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.email = email;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified and updated" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

module.exports = router;
