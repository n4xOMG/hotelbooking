const express = require("express");
const { verifyToken } = require("../config/jwtConfig");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

const router = express.Router();

// Create a new booking
router.post("/", verifyToken, async (req, res) => {
  const { hotelId, roomId, checkInDate, checkOutDate, totalPrice } = req.body;
  const userId = req.user._id;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const newBooking = new Booking({
      user: userId,
      hotel: hotelId,
      room: roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Get all bookings for a user
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user._id;

  try {
    const bookings = await Booking.find({ user: userId })
      .populate("hotel", "name location")
      .populate("room", "roomType size beds baths price");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Get a specific booking
router.get("/:id", verifyToken, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user._id;

  try {
    const booking = await Booking.findOne({ _id: bookingId, user: userId })
      .populate("hotel", "name location")
      .populate("room", "roomType size beds baths price");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Update a booking
router.put("/:id", verifyToken, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user._id;
  const { checkInDate, checkOutDate, totalPrice, status } = req.body;

  try {
    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.checkInDate = checkInDate || booking.checkInDate;
    booking.checkOutDate = checkOutDate || booking.checkOutDate;
    booking.totalPrice = totalPrice || booking.totalPrice;
    booking.status = status || booking.status;

    await booking.save();
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Delete a booking
router.delete("/:id", verifyToken, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user._id;

  try {
    const booking = await Booking.findOneAndDelete({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

module.exports = router;
