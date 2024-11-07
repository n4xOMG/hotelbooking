const express = require("express");
const Hotel = require("../models/Hotel");
const { verifyToken } = require("../config/jwtConfig");

const router = express.Router();

router.get("/", async (req, res) => {
  const filters = req.query;
  const hotels = await Hotel.find(filters);
  res.json(hotels);
});

router.get("/:id", async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  res.json(hotel);
});

// Create hotel
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, location, price } = req.body;

    if (!name || !description || !location || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newHotel = new Hotel({
      ...req.body,
      owner: req.user.id,
    });

    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (error) {
    console.error("Create hotel error:", error);
    res.status(500).json({ message: "Failed to create hotel", error: error.message });
  }
});

// Update hotel
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const hotelId = req.params.id;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    if (hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this hotel" });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, req.body, { new: true, runValidators: true });

    res.json(updatedHotel);
  } catch (error) {
    console.error("Update hotel error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid hotel data", error: error.message });
    }
    res.status(500).json({ message: "Failed to update hotel", error: error.message });
  }
});

// Book hotel
router.post("/:id/book", verifyToken, async (req, res) => {
  try {
    const hotelId = req.params.id;
    const { checkIn, checkOut, guests } = req.body;

    if (!checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: "Missing required booking details" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json({ message: "Hotel booked successfully" });
  } catch (error) {
    console.error("Book hotel error:", error);
    res.status(500).json({ message: "Failed to book hotel", error: error.message });
  }
});

module.exports = router;
