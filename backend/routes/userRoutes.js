const express = require("express");
const User = require("../models/User");
const { verifyToken } = require("../config/jwtConfig");

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

// Cập nhật hồ sơ cá nhân
router.put("/profile", verifyToken, async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { username, email }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Lấy danh sách user (chỉ admin)
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

// Lấy một user cụ thể qua ID (chỉ admin)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Cập nhật user qua ID (chỉ admin)
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
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