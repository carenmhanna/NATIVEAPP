const express = require("express");
const medicationAdherenceController = require("../controllers/medicationAdherenceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes
router.post("/", protect, medicationAdherenceController.createLog); // Create a medication adherence log
router.get("/", protect, medicationAdherenceController.getLogs); // Get all logs for the authenticated user
router.get("/:id", protect, medicationAdherenceController.getLogById); // Get a specific log by ID
router.put("/:id", protect, medicationAdherenceController.updateLog); // Update a log by ID
router.delete("/:id", protect, medicationAdherenceController.deleteLog); // Delete a log by ID

module.exports = router;