const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const { verifyToken } = require("../config/jwtConfig");

router.get("/", verifyToken, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "firstname lastname username")
      .populate("messages.sender", "firstname lastname username")
      .sort({ "messages.timestamp": -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      participants: { $all: [req.user.id, req.params.userId] },
    })
      .populate("participants", "firstname lastname username")
      .populate("messages.sender", "firstname lastname username");

    if (!chat) {
      const newChat = new Chat({
        participants: [req.user.id, req.params.userId],
        messages: [],
      });
      await newChat.save();
      return res.json(newChat);
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
