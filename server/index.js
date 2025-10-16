const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
try {
  fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });
} catch {}

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running on Render 🚀");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/health", async (_req, res) => {
  try {
    const state = mongoose.connection.readyState; // 1 = connected, 2 = connecting
    res.json({ ok: true, mongoState: state });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

// API routes
app.use("/api/projects", require("./routes/projects"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/contact", require("./routes/contact"));

// MongoDB connection
const uri = process.env.URI;
if (!uri) {
  console.error("❌ MongoDB URI not set in environment variables");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 1011;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
