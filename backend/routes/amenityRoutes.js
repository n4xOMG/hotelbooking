const express = require("express");
const { verifyToken } = require("../config/jwtConfig");
const {
  createAmenity,
  getAllAmenities,
  getAmenityById,
  updateAmenityById,
  deleteAmenityById,
} = require("../controllers/amenityController");

const router = express.Router();

// Create a new amenity (admin only)
router.post("/", verifyToken, createAmenity);

// Get all amenities with search and filter
router.get("/", getAllAmenities);

// Get a single amenity by ID
router.get("/:id", getAmenityById);

// Update an amenity by ID (admin only)
router.put("/:id", verifyToken, updateAmenityById);

// Delete an amenity by ID (admin only)
router.delete("/:id", verifyToken, deleteAmenityById);

module.exports = router;