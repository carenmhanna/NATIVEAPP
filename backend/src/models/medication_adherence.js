const mongoose = require("mongoose");

const medication_adherence = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  log_date: {
    type: Date,
    required: true,
  },

  med_taken_on_time: {
    type: Boolean,
    required: true,
  },

  prm_med: {
    quantity: Number,
  },

  missed_med: [
    {
      medication_name: {
        type: String,
        required: true,
      },
      quantity_missed: {
        type: Number,
        required: true,
      },
    },
  ],
});

// Validation function to check if missed_med contains only valid medications
medication_adherence.path("missed_med").validate(function (value) {
  // Example validation logic (you can customize this)
  if (!Array.isArray(value)) {
    throw new Error("missed_med must be an array");
  }
  return true;
});

module.exports = mongoose.model("medication_adherence", medication_adherence);