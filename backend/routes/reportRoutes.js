const express = require("express");
const Report = require("../models/Report");
const { verifyToken } = require("../config/jwtConfig");

const router = express.Router();

// Create a new report
router.post("/", verifyToken, async (req, res) => {
  const { type, itemId, reason } = req.body;

  try {
    const newReport = new Report({
      reportedBy: req.user.id,
      type,
      itemId,
      reason,
    });
    await newReport.save();
    res.status(201).json({ message: "Report created successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Get all reports (admin only)
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const reports = await Report.find().populate("reportedBy", "username email");
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Update report status (admin only)
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { reason,status } = req.body;

  try {
    const report = await Report.findByIdAndUpdate(req.params.id, { reason, status }, { new: true });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({ message: "Report status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// Delete a report (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

module.exports = router;
