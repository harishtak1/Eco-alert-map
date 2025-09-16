const express = require("express");
const multer = require("multer");
const Report = require("../models/Report");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Submit report
router.post("/report", upload.single("photo"), async (req, res) => {
  try {
    const { location, type, description } = req.body;
    const newReport = new Report({
      location,
      type,
      description,
      photo: req.file ? req.file.filename : null
    });
    await newReport.save();
    res.json({ message: "✅ Report submitted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all reports
router.get("/reports", async (req, res) => {
  const reports = await Report.find();
  res.json(reports);
});

module.exports = router;
