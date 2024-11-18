const express = require("express");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const { verifyToken } = require("../config/jwtConfig");
const { isHotelAvailable } = require("../utils/checkAvailability");

const router = express.Router();

// Get all hotels with optional filters
router.get("/", async (req, res) => {
  const filters = req.query;
  try {
    const hotels = await Hotel.find(filters)
      .populate("owner", "firstname lastname email")
      .populate("propertyType", "type icon")
      .populate("categories", "name description icon")
      .populate("rooms")
      .populate("amenities", "name description icon")
      .populate("ratings");
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// GET /hotels/search
router.get("/search", async (req, res) => {
  try {
    const { location, checkIn, checkOut, maxGuests } = req.query;

    // Parse and validate dates if provided
    let checkInDate, checkOutDate;
    if (checkIn) {
      checkInDate = new Date(checkIn);
      if (isNaN(checkInDate)) {
        return res.status(400).json({ error: "Invalid check-in date format." });
      }
    }

    if (checkOut) {
      checkOutDate = new Date(checkOut);
      if (isNaN(checkOutDate)) {
        return res.status(400).json({ error: "Invalid check-out date format." });
      }
    }

    // If one of the dates is provided, ensure both are present
    if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
      return res.status(400).json({
        error: "Both check-in and check-out dates must be provided together.",
      });
    }

    // If both dates are provided, validate their order
    if (checkInDate && checkOutDate && checkInDate >= checkOutDate) {
      return res.status(400).json({ error: "Check-out date must be after check-in date." });
    }

    // Build hotel query based on location, maxGuests, and isAvailable
    const hotelQuery = { isAvailable: true };
    if (location) {
      hotelQuery.location = { $regex: location, $options: "i" };
    }
    if (maxGuests) {
      hotelQuery.maxGuests = { $gte: Number(maxGuests) };
    }

    // Find hotels matching location, maxGuests, and isAvailable and populate necessary fields
    const hotels = await Hotel.find(hotelQuery)
      .populate("owner", "username avatarUrl")
      .populate("propertyType", "name")
      .populate("categories", "name")
      .populate("amenities", "name")
      .populate("rooms");

    let availableHotels = [];

    if (checkInDate && checkOutDate) {
      // If both check-in and check-out dates are provided, filter hotels based on availability
      const availabilityPromises = hotels.map(async (hotel) => {
        const available = await isHotelAvailable(hotel._id, checkInDate, checkOutDate);
        return available ? hotel : null;
      });

      const results = await Promise.all(availabilityPromises);
      availableHotels = results.filter((hotel) => hotel !== null);
    } else {
      // If dates are not provided, return all hotels matching location, maxGuests, and isAvailable
      availableHotels = hotels;
    }

    res.json(availableHotels);
  } catch (error) {
    console.error("Error searching hotels:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// GET /hotels/available
router.get("/available", async (req, res) => {
  try {
    const availableHotels = await Hotel.find({ isAvailable: true });

    res.json(availableHotels);
  } catch (error) {
    console.error("Error retrieving available hotels:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a single hotel by ID
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate("owner", "username avatarUrl firstname lastname email")
      .populate("propertyType", "type icon")
      .populate("categories", "name description icon")
      .populate("rooms")
      .populate("amenities", "name description icon")
      .populate("ratings");
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Get hotels by user
router.get("/user/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const hotels = await Hotel.find({ owner: userId })
      .populate("owner", "username avatarUrl firstname lastname email")
      .populate("propertyType", "type icon")
      .populate("categories", "name description icon")
      .populate("rooms")
      .populate("amenities", "name description icon");
    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: "No hotels found for this user" });
    }
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Create a new hotel (hotel owner only)
router.post("/", verifyToken, async (req, res) => {
  const {
    name,
    description,
    location,
    propertyType,
    categories,
    maxGuests,
    petFriendly,
    rooms,
    totalRooms,
    totalBeds,
    totalBaths,
    pricePerNight,
    amenities,
    isAvailable,
    images,
  } = req.body;

  try {
    // Create room documents and get their IDs
    const roomIds = await Promise.all(
      rooms.map(async (room) => {
        const newRoom = new Room({
          hotel: null, // Temporary, will set after hotel creation
          roomNumber: room.roomNumber,
          type: room.type,
          price: room.price,
          // Add other room fields as necessary
        });
        await newRoom.save();
        return newRoom._id;
      })
    );

    // Prepare hotel data
    const newHotel = new Hotel({
      name,
      description,
      location,
      propertyType,
      categories,
      maxGuests,
      petFriendly,
      rooms: roomIds,
      totalRooms,
      totalBeds,
      totalBaths,
      pricePerNight,
      amenities,
      isAvailable,
      images,
      owner: req.user.id, // Assuming req.user is set by verifyToken
    });

    await newHotel.save();

    // Update rooms with the hotel reference
    await Room.updateMany({ _id: { $in: roomIds } }, { $set: { hotel: newHotel._id } });

    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Update a hotel (hotel owner only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const hotelId = req.params.id;
    const updateData = req.body;

    // Verify ownership
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    if (hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this hotel." });
    }

    // Update hotel details
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updateData, { new: true })
      .populate("owner", "username avatarUrl firstname lastname email")
      .populate("propertyType", "type icon")
      .populate("categories", "name description icon")
      .populate("rooms")
      .populate("amenities", "name description icon")
      .populate("ratings");

    res.status(200).json(updatedHotel);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Delete a hotel (hotel owner only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const hotelId = req.params.id;

    // Verify ownership
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    if (hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this hotel." });
    }

    // Delete associated rooms
    await Room.deleteMany({ hotel: hotelId });

    // Delete the hotel
    await Hotel.findByIdAndDelete(hotelId);

    res.status(200).json({ message: "Hotel deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

module.exports = router;
