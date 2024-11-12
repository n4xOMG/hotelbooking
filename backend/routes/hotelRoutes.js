const express = require("express");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const { verifyToken } = require("../config/jwtConfig");

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

// Get a single hotel by ID
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate("owner", "firstname lastname email")
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
    images,
  } = req.body;

  try {
    // Create room documents and get their IDs
    const roomIds = await Promise.all(
      rooms.map(async (room) => {
        const newRoom = new Room(room);
        await newRoom.save();
        return newRoom._id;
      })
    );

    // Prepare hotel data
    const hotelData = {
      owner: req.user.id,
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
      images,
    };

    const newHotel = new Hotel(hotelData);
    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Update a hotel (hotel owner only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    if (hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

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
      images,
    } = req.body;

    // Create room documents and get their IDs if new rooms are provided
    let roomIds = hotel.rooms;
    if (rooms && rooms.length > 0) {
      roomIds = await Promise.all(
        rooms.map(async (room) => {
          const newRoom = new Room(room);
          await newRoom.save();
          return newRoom._id;
        })
      );
    }

    // Prepare hotel data
    const hotelData = {
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
      images,
    };

    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, hotelData, { new: true });
    res.json(updatedHotel);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Delete a hotel (hotel owner only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    if (hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await hotel.remove();
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

module.exports = router;
