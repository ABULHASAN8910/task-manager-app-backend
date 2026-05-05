const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/team");
const chatRoutes = require("./routes/chat");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const db = require("./config/db");  // Centralized DB

const app = express();

app.use(cors());
app.use(express.json());

// Mount ALL routes
app.use("/auth", authRoutes);
app.use("/teams", teamRoutes);
app.use("/chat", chatRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// TEST API
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// Health check with DB
app.get("/health", (req, res) => {
  db.ping((err) => {
    if (err) return res.status(500).json({ db: 'error' });
    res.json({ status: 'OK', db: 'connected' });
  });
});

// Start server only if DB connected
db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection failed. Server not starting:", err);
    process.exit(1);
  }
  console.log("✅ Database connected");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📋 Health: http://localhost:${PORT}/health`);
  });
});
