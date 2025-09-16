// backend/models/alertModel.js
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  lat: Number,                 // map ke liye
  lng: Number,                 // map ke liye
  imageUrl: String,            // uploaded image ka URL
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);
