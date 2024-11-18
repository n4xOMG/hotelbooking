const express = require("express");
const { verifyToken } = require("../config/jwtConfig");
const Rating = require("../models/Rating");
const Hotel = require("../models/Hotel");

const router = express.Router();

// Helper function to update avgRating of a hotel
const updateHotelAvgRating = async (hotelId) => {
  try {
    const ratings = await Rating.find({ hotel: hotelId });
    if (ratings.length === 0) {
      await Hotel.findByIdAndUpdate(hotelId, { avgRating: 0 });
    } else {
      const avg = ratings.reduce((acc, rating) => acc + rating.value, 0) / ratings.length;
      await Hotel.findByIdAndUpdate(hotelId, { avgRating: avg });
    }
  } catch (error) {
    console.error("Error updating average rating:", error);
    throw error;
  }
};

// Create a new rating
router.post("/", verifyToken, async (req, res) => {
  const { value, comment, images, hotel } = req.body;
  const userId = req.user.id;

  try {
    // Check if the user has already rated this hotel
    const existingRating = await Rating.findOne({ user: userId, hotel });
    if (existingRating) {
      return res.status(400).json({ message: "You have already rated this hotel." });
    }

    const newRating = new Rating({
      user: userId,
      hotel,
      value,
      comment,
      images,
    });

    await newRating.save();

    // Add rating to hotel's ratings array
    await Hotel.findByIdAndUpdate(hotel, { $push: { ratings: newRating._id } });

    // Update the average rating of the hotel
    await updateHotelAvgRating(hotel);

    res.status(201).json(newRating);
  } catch (error) {
    // Handle duplicate key error gracefully
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already rated this hotel." });
    }
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

// Get ratings by hotel
router.get("/hotel/:hotelId", async (req, res) => {
  const { hotelId } = req.params;

  try {
    const hotel = await Hotel.findById(hotelId).populate("ratings");
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const ratings = await Rating.find({ hotel: hotelId }).populate("user", "avatarUrl firstname lastname email");
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
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

    // Update the average rating of the hotel
    await updateHotelAvgRating(rating.hotel);

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

    const hotelId = rating.hotel;

    await rating.remove();

    // Remove rating from hotel's ratings array
    await Hotel.findByIdAndUpdate(hotelId, { $pull: { ratings: rating._id } });

    // Update the average rating of the hotel
    await updateHotelAvgRating(hotelId);

    res.json({ message: "Rating deleted" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

module.exports = router;
