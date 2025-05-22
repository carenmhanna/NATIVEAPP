const express = require("express");
const sleepAndFatigueController = require("../controllers/sleepAndFatigueController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes
router.post("/", protect, sleepAndFatigueController.createLog); // Create a sleep and fatigue log
router.get("/", protect, sleepAndFatigueController.getLogs); // Get all logs for the authenticated user
router.get("/:id", protect, sleepAndFatigueController.getLogById); // Get a specific log by ID
router.put("/:id", protect, sleepAndFatigueController.updateLog); // Update a log by ID
router.delete("/:id", protect, sleepAndFatigueController.deleteLog); // Delete a log by ID

module.exports = router;