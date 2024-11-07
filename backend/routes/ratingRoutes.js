const express = require("express");
const { verifyToken } = require("../config/jwtConfig");
const Rating = require("../models/Rating");

const router = express.Router();

// Create a new rating
router.post("/", verifyToken, async (req, res) => {
  const { value, comment, images } = req.body;
  const userId = req.user.id;

  try {
    const newRating = new Rating({
      user: userId,
      value,
      comment,
      images,
    });

    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: "Failed to create rating", error: error.message });
  }
});

// Get ratings by user
router.get("/user", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const ratings = await Rating.find({ user: userId });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Failed to get ratings", error: error.message });
  }
});

// Get all ratings
router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.find().populate("user", "username");
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Get a specific rating by ID
router.get("/:id", async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id).populate("user", "username");
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }
    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Update a rating
router.put("/:id", verifyToken, async (req, res) => {
  const { value, comment, images } = req.body;
  const userId = req.user.id;

  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    if (rating.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    rating.value = value;
    rating.comment = comment;
    rating.images = images;
    await rating.save();

    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Delete a rating
router.delete("/:id", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    if (rating.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await rating.remove();
    res.json({ message: "Rating deleted" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

module.exports = router;
