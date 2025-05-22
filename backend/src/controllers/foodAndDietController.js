const FoodAndDiet = require("../models/food_and_diet");

// Create a new food and diet log
exports.createLog = async (req, res) => {
  try {
    const log = new FoodAndDiet({
      ...req.body,
      userId: req.user._id, // Attach the authenticated user's ID
    });
    await log.save();
    res.status(201).json({ message: "Food and diet log created successfully", log });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all food and diet logs for the authenticated user
exports.getLogs = async (req, res) => {
  try {
    const logs = await FoodAndDiet.find({ userId: req.user._id });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific food and diet log by ID (only if it belongs to the authenticated user)
exports.getLogById = async (req, res) => {
  try {
    const log = await FoodAndDiet.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a food and diet log by ID (only if it belongs to the authenticated user)
exports.updateLog = async (req, res) => {
  try {
    const log = await FoodAndDiet.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }
    res.status(200).json({ message: "Log updated successfully", log });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a food and diet log by ID (only if it belongs to the authenticated user)
exports.deleteLog = async (req, res) => {
  try {
    const log = await FoodAndDiet.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }
    res.status(200).json({ message: "Log deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};