const Seizure = require("../models/seizure");
const getPastSeizureDays = require('../utils/PastSeizureDays');


// Create a new seizure record
exports.createSeizure = async (req, res) => {
  try {
    const seizure = new Seizure({
      ...req.body,
      userId: req.user._id, // Attach the authenticated user's ID
    });
    await seizure.save();
    res.status(201).json({ message: "Seizure record created successfully", seizure });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all seizure records for the authenticated user
exports.getSeizures = async (req, res) => {
  try {
    const seizures = await Seizure.find({ userId: req.user._id });
    res.status(200).json(seizures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific seizure record by ID (only if it belongs to the authenticated user)
exports.getSeizureById = async (req, res) => {
  try {
    const seizure = await Seizure.findOne({ _id: req.params.id, userId: req.user._id });
    if (!seizure) {
      return res.status(404).json({ message: "Seizure record not found" });
    }
    res.status(200).json(seizure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a seizure record by ID (only if it belongs to the authenticated user)
exports.updateSeizure = async (req, res) => {
  try {
    const seizure = await Seizure.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!seizure) {
      return res.status(404).json({ message: "Seizure record not found" });
    }
    res.status(200).json({ message: "Seizure record updated successfully", seizure });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a seizure record by ID (only if it belongs to the authenticated user)
exports.deleteSeizure = async (req, res) => {
  try {
    const seizure = await Seizure.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!seizure) {
      return res.status(404).json({ message: "Seizure record not found" });
    }
    res.status(200).json({ message: "Seizure record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all unique seizure days for the authenticated user
exports.getSeizureDays = async (req, res) => {
  try {
    const userId = req.user._id;
    const days = await getPastSeizureDays(userId);
    res.status(200).json(days);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};