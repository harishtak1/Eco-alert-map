const express = require("express");
const multer = require("multer");
const path = require("path");
const Alert = require("../models/Alert");
const Notification = require("../models/Notification");

const router = express.Router();

// ✅ Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Create new alert + notification
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, location, lat, lng } = req.body;
    if (!title || !description || !location || !lat || !lng) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const newAlert = await Alert.create({
      title,
      description,
      location,
      lat,
      lng,
      imageUrl: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null,
    });

    // 🔔 Create notification
    await Notification.create({
      userId: "dummyUser123",
      message: `Your report "${newAlert.title}" was submitted and is pending approval.`,
    });

    res.status(201).json(newAlert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update status (approve/reject) + notification
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const alert = await Alert.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!alert) return res.status(404).json({ message: "Alert not found" });

    await Notification.create({
      userId: "dummyUser123",
      message: `Your report "${alert.title}" was ${status}.`,
    });

    res.json({ message: `✅ Status updated to ${status}`, alert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
