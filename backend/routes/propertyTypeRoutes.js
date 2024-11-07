const express = require("express");
const { verifyToken } = require("../config/jwtConfig");
const PropertyType = require("../models/PropertyType");

const router = express.Router();

// Create a new property type (admin only)
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: `Access denied with user role ${req.user.role}` });
  }

  const { type, description, icon } = req.body;

  try {
    const newPropertyType = new PropertyType({ type, description, icon });
    await newPropertyType.save();
    res.status(201).json(newPropertyType);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Get all property types
router.get("/", async (req, res) => {
  try {
    const propertyTypes = await PropertyType.find();
    res.json(propertyTypes);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Get a single property type by ID
router.get("/:id", async (req, res) => {
  try {
    const propertyType = await PropertyType.findById(req.params.id);
    if (!propertyType) {
      return res.status(404).json({ message: "Property type not found" });
    }
    res.json(propertyType);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Update a property type (admin only)
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { type, description, icon } = req.body;

  try {
    const propertyType = await PropertyType.findByIdAndUpdate(req.params.id, { type, description, icon }, { new: true });
    if (!propertyType) {
      return res.status(404).json({ message: "Property type not found" });
    }
    res.json(propertyType);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Delete a property type (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const propertyType = await PropertyType.findByIdAndDelete(req.params.id);
    if (!propertyType) {
      return res.status(404).json({ message: "Property type not found" });
    }
    res.json({ message: "Property type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

module.exports = router;
