const express = require("express");
const Alert = require("../models/Alert");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Create alert (user side)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, location, lat, lng, imageUrl } = req.body;
    const alert = await Alert.create({ title, description, location, lat, lng, imageUrl });
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all alerts (public map view) — sirf approved wale
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin — get all alerts (pending, approved, rejected)
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin — update alert status
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
