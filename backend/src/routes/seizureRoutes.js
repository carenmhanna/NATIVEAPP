const express = require("express");
const seizureController = require("../controllers/seizureController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes
router.post("/", protect, seizureController.createSeizure); // Create a seizure record
router.get("/days", protect, seizureController.getSeizureDays); // <-- Place this before /:id
router.get("/", protect, seizureController.getSeizures); // Get all seizure records for the authenticated user
router.get("/:id", protect, seizureController.getSeizureById); // Get a specific seizure record by ID
router.put("/:id", protect, seizureController.updateSeizure); // Update a seizure record by ID
router.delete("/:id", protect, seizureController.deleteSeizure); // Delete a seizure record by ID
module.exports = router;