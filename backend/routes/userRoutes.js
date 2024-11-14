const express = require("express");
const User = require("../models/User");
const { verifyToken } = require("../config/jwtConfig");

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
  const { username, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { username, email }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Get list of users with search and filter functionality
router.get("/users", verifyToken, async (req, res) => {
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
router.put("/users/:id", verifyToken, async (req, res) => {
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