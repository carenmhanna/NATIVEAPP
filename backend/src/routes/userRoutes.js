const express = require("express");
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/register", userController.createUser);
router.post("/login",    userController.loginUser);

// Protected
router.get("/me",         protect, userController.getCurrentUser);
router.get("/:id",        protect, userController.getUserById);
router.put("/:id",        protect, userController.updateUser);
router.put("/:id/add-medication", protect, userController.addMedication);
router.delete("/:id",     protect, userController.deleteUser);

module.exports = router;
