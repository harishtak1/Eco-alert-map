const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  lat: Number,
  lng: Number,
  image: String, // optional: image ka URL
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
