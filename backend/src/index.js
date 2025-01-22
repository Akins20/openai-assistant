import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import documentRoutes from "./routes/document.js";
import assistantRoutes from "./routes/assistant.js"; 

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Enable CORS for all routes
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // Allow all origins if CORS_ORIGIN is not set
  })
);

// MongoDB URI
const DEV_MONGODB_URI = "mongodb://localhost:27017/"; // Replace `myapp` with your database name
const MONGODB_URI = process.env.MONGODB_URI || DEV_MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/assistants", assistantRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
