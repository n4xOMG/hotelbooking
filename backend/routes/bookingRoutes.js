const express = require("express");
const { verifyToken } = require("../config/jwtConfig");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

const router = express.Router();

// Create a new booking
router.post("/", verifyToken, async (req, res) => {
  const { hotelId, room, checkInDate, checkOutDate } = req.body;
  const userId = req.user.id;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const booking = new Booking({
      user: userId,
      hotel: hotelId,
      room,
      bookingDate: new Date(),
      checkInDate,
      checkOutDate,
      totalPrice: room.price * ((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)),
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Get all bookings for a user
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.find({ user: userId }).populate("hotel room");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Get a specific booking
router.get("/:id", verifyToken, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  try {
    const booking = await Booking.findOne({ _id: bookingId, user: userId }).populate("hotel room");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Cancel a booking
router.delete("/:id", verifyToken, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  try {
    const booking = await Booking.findOneAndDelete({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

module.exports = router;
