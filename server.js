const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve images

// ✅ Routes
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/auth", require("./routes/auth"));  // 👈 Auth routes
app.use("/api/notifications", require("./routes/notificationRoutes"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
