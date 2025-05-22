const MenstrualCycle = require("../models/menstrual_cycle");

// Create a new menstrual cycle log
exports.createLog = async (req, res) => {
  try {
    const log = new MenstrualCycle({
      ...req.body,
      userId: req.user._id, // Attach the authenticated user's ID
    });
    await log.save();
    res.status(201).json({ message: "Menstrual cycle log created successfully", log });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all menstrual cycle logs for the authenticated user
exports.getLogs = async (req, res) => {
  try {
    const logs = await MenstrualCycle.find({ userId: req.user._id });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific menstrual cycle log by ID (only if it belongs to the authenticated user)
exports.getLogById = async (req, res) => {
  try {
    const log = await MenstrualCycle.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a menstrual cycle log by ID (only if it belongs to the authenticated user)
exports.updateLog = async (req, res) => {
  try {
    const log = await MenstrualCycle.findOneAndUpdate(
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

// Delete a menstrual cycle log by ID (only if it belongs to the authenticated user)
exports.deleteLog = async (req, res) => {
  try {
    const log = await MenstrualCycle.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }
    res.status(200).json({ message: "Log deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};