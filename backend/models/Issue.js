const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  lat: Number,
  lng: Number,
  imageUrl: String,          // Uploaded image ka URL
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);
