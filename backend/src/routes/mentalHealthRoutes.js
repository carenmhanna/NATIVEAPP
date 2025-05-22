const express = require("express");
const mentalHealthController = require("../controllers/mentalHealthController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes
router.post("/", protect, mentalHealthController.createLog); // Create a mental health log
router.get("/", protect, mentalHealthController.getLogs); // Get all logs for the authenticated user
router.get("/:id", protect, mentalHealthController.getLogById); // Get a specific log by ID
router.put("/:id", protect, mentalHealthController.updateLog); // Update a log by ID
router.delete("/:id", protect, mentalHealthController.deleteLog); // Delete a log by ID

module.exports = router;