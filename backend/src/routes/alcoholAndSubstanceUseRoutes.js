const express = require("express");
const alcoholAndSubstanceUseController = require("../controllers/alcoholAndSubstanceUseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes
router.post("/", protect, alcoholAndSubstanceUseController.createLog); // Create a log
router.get("/", protect, alcoholAndSubstanceUseController.getLogs); // Get all logs for the authenticated user
router.get("/:id", protect, alcoholAndSubstanceUseController.getLogById); // Get a specific log by ID
router.put("/:id", protect, alcoholAndSubstanceUseController.updateLog); // Update a log by ID
router.delete("/:id", protect, alcoholAndSubstanceUseController.deleteLog); // Delete a log by ID

module.exports = router;