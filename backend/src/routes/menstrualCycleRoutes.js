const express = require("express");
const menstrualCycleController = require("../controllers/menstrualCycleController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes
router.post("/", protect, menstrualCycleController.createLog); // Create a menstrual cycle log
router.get("/", protect, menstrualCycleController.getLogs); // Get all logs for the authenticated user
router.get("/:id", protect, menstrualCycleController.getLogById); // Get a specific log by ID
router.put("/:id", protect, menstrualCycleController.updateLog); // Update a log by ID
router.delete("/:id", protect, menstrualCycleController.deleteLog); // Delete a log by ID

module.exports = router;