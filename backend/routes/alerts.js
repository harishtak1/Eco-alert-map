const express = require("express");
const Alert = require("../models/Alert");
const Notification = require("../models/Notification");
const router = express.Router();

// ✅ Get alerts (optional filter by status/userId)
router.get("/", async (req, res) => {
  try {
    const { status, userId } = req.query;
    let query = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }
    if (userId) {
      query.userId = userId;
    }

    const alerts = await Alert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Create alert
router.post("/", async (req, res) => {
  try {
    const { title, description, location, lat, lng, imageUrl, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const alert = await Alert.create({
      title,
      description,
      location,
      lat,
      lng,
      imageUrl,
      userId,
    });

    // 🔔 Notification
    await Notification.create({
      userId,
      message: `Your report "${title}" was submitted and is pending approval.`,
    });

    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    // 🔔 Notify user
    await Notification.create({
      userId: alert.userId,
      message: `Your report "${alert.title}" was ${status}.`,
    });

    res.json({ message: `✅ Status updated to ${status}`, alert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
