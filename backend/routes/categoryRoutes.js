const express = require("express");
const Category = require("../models/Category");
const { verifyToken } = require("../config/jwtConfig");

const router = express.Router();

// Create a new category (admin only)
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { name, description, icon } = req.body;

  try {
    const newCategory = new Category({ name, description, icon });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Get all categories with search and filter
router.get("/", async (req, res) => {
  try {
    const { name, description, icon } = req.query;

    // Build filter object based on query params
    const filter = {};
    if (name) filter.name = new RegExp(name, "i"); // Case-insensitive regex search
    if (description) filter.description = new RegExp(description, "i");
    if (icon) filter.icon = new RegExp(icon, "i");

    const categories = await Category.find(filter);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Get a single category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Update a category (admin only)
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { name, description, icon } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { name, description, icon }, { new: true });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Delete a category (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

module.exports = router;
