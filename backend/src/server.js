require("dotenv").config({ path: "../.env" });
const app = require("./app");
const { PORT, MONGO_URI } = require("./config");
const mongoose = require("mongoose");


// ======================
// MongoDB Connection
// ======================
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ======================
// Start Server
// ======================
const server = app.listen(PORT || 5000, () => {
  console.log(`Server running on port ${PORT || 5000}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// ======================
// Graceful Shutdown
// ======================
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});