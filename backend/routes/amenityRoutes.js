const express = require("express");
const Amenity = require("../models/Amenity");
const { verifyToken } = require("../config/jwtConfig");

const router = express.Router();

// Create a new amenity (admin only)
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { name } = req.body;

  try {
    const newAmenity = new Amenity({ name });
    await newAmenity.save();
    res.status(201).json(newAmenity);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Get all amenities
router.get("/", async (req, res) => {
  try {
    const amenities = await Amenity.find();
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Get a single amenity by ID
router.get("/:id", async (req, res) => {
  try {
    const amenity = await Amenity.findById(req.params.id);
    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }
    res.json(amenity);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Update an amenity (admin only)
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { name } = req.body;

  try {
    const amenity = await Amenity.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }
    res.json(amenity);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Delete an amenity (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const amenity = await Amenity.findByIdAndDelete(req.params.id);
    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }
    res.json({ message: "Amenity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

module.exports = router;
