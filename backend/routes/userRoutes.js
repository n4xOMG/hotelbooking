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

router.get("/", verifyToken, async (req, res) => {
  try {
    const { search, role, isActive } = req.query;

    // Build the query object based on provided query parameters
    let query = {};

    // Search by username or email using case-insensitive regex
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role if provided
    if (role) {
      query.role = role;
    }

    // Filter by account status if provided
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    // Execute the query with the constructed filters
    const users = await User.find(query).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});


// Get list of users with search and filter functionality
router.get("/", verifyToken, async (req, res) => {
  const { search, role } = req.query;
  try {
    let query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select("-password -resetPasswordToken -resetPasswordExpires");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Update user by ID
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin" && req.user.id !== req.params.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const { username, email, phoneNumber, role, gender, birthdate } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, phoneNumber, role, gender, birthdate },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

module.exports = router;