import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// Load environment variables
dotenv.config();

import connectDB from "./config/db.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import doubtRoutes from "./routes/doubtRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/comments", commentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("DevHelp Doubt Tracker API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
