const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/team");
const chatRoutes = require("./routes/chat");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/teams", teamRoutes);
app.use("/chat", chatRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// Health check
app.get("/health", (req, res) => {
  db.ping((err) => {
    if (err) return res.status(500).json({ db: "error" });
    res.json({ status: "OK", db: "connected" });
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ✅ START SERVER ONLY AFTER DB CONNECTS
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});