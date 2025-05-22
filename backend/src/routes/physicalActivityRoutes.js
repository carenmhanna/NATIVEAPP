const express = require("express");
const physicalActivityController = require("../controllers/physicalActivityController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes
router.post("/", protect, physicalActivityController.createLog); // Create a physical activity log
router.get("/", protect, physicalActivityController.getLogs); // Get all logs for the authenticated user
router.get("/:id", protect, physicalActivityController.getLogById); // Get a specific log by ID
router.put("/:id", protect, physicalActivityController.updateLog); // Update a log by ID
router.delete("/:id", protect, physicalActivityController.deleteLog); // Delete a log by ID

module.exports = router;