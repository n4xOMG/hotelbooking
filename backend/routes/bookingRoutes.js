const express = require("express");
const { verifyToken } = require("../config/jwtConfig");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const { isHotelAvailable } = require("../utils/checkAvailability"); // Import the utility function

const router = express.Router();

// Create a new booking
router.post("/", verifyToken, async (req, res) => {
  const { hotelId, checkInDate, checkOutDate, totalPrice } = req.body;
  const userId = req.user.id;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    // Check availability before booking
    const available = await isHotelAvailable(hotelId, new Date(checkInDate), new Date(checkOutDate));
    if (!available) {
      return res.status(400).json({ message: "No available rooms for the selected dates." });
    }

    const newBooking = new Booking({
      user: userId,
      hotel: hotelId,
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
router.get("/user", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.find({ user: userId }).populate("hotel", "name location");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Get bookings by hotel
router.get("/hotel/:hotelId", verifyToken, async (req, res) => {
  const hotelId = req.params.hotelId;

  try {
    const bookings = await Booking.find({ hotel: hotelId }).populate("user", "firstname lastname email");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Get bookings for hotels managed by the user
router.get("/managed", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const hotels = await Hotel.find({ owner: userId });
    const hotelIds = hotels.map((hotel) => hotel._id);
    const bookings = await Booking.find({ hotel: { $in: hotelIds } })
      .populate("hotel", "name location")
      .populate("user", "firstname lastname email");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Get a specific booking
router.get("/:id", verifyToken, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  try {
    const booking = await Booking.findOne({ _id: bookingId, user: userId }).populate("hotel", "name location");
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
  const userId = req.user.id;
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
  const userId = req.user.id;

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

// Check Availability Endpoint
router.get("/check-availability/:hotelId", async (req, res) => {
  const { hotelId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    // Parse dates from query parameters
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    if (parsedStartDate >= parsedEndDate) {
      return res.status(400).json({ error: "End date must be after start date." });
    }

    // Check availability using the utility function
    const available = await isHotelAvailable(hotelId, parsedStartDate, parsedEndDate);

    res.json({ isAvailable: available });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

module.exports = router;
