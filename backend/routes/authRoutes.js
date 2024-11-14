const express = require("express");
const sendEmail = require("../utils/emailService");
const { generateToken } = require("../config/jwtConfig");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstname, lastname, phoneNumber, username, email, password, gender, avatarUrl, birthdate } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new User({
      firstname,
      lastname,
      phoneNumber,
      username,
      email,
      password,
      gender,
      avatarUrl,
      birthdate,
    });
    await newUser.save();

    // Send a welcome email
    const message = `<p>Welcome, ${firstname}! Thank you for registering on our platform.</p>`;
    await sendEmail(newUser.email, "Welcome to Hotel Booking", message);

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordValid(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id, role: user.role });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate token and expiration
  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send password reset email
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const message = `<p>To reset your password, please click the link below:</p>
                   <a href="${resetUrl}">Reset Password</a>`;
  await sendEmail(user.email, "Password Reset", message);

  res.json({ message: "Password reset email sent" });
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

module.exports = router;
