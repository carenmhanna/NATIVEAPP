const express = require("express");
const foodAndDietController = require("../controllers/foodAndDietController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes
router.post("/", protect, foodAndDietController.createLog); // Create a food and diet log
router.get("/", protect, foodAndDietController.getLogs); // Get all logs for the authenticated user
router.get("/:id", protect, foodAndDietController.getLogById); // Get a specific log by ID
router.put("/:id", protect, foodAndDietController.updateLog); // Update a log by ID
router.delete("/:id", protect, foodAndDietController.deleteLog); // Delete a log by ID

module.exports = router;