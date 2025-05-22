const mongoose = require("mongoose");

const sleepAndFatigueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  log_date: { type: Date, required: true },
  sleep_start: { type: Number, required: true },
  sleep_start_unit: { type: String, enum: ["AM", "PM"], required: true },
  sleep_end: { type: Number, required: true },
  sleep_end_unit: { type: String, enum: ["AM", "PM"], required: true },
  sleep_quality: { type: Number, required: true, min: 0, max: 10 },
  daytime_fatigue: { type: Number, required: true, min: 0, max: 10 },
  nap: {
    type: [
      {
        nap_start: { type: Number, required: true },
        nap_start_unit: { type: String, enum: ["AM", "PM"], required: true },
        nap_end: { type: Number, required: true },
        nap_end_unit: { type: String, enum: ["AM", "PM"], required: true },
        sleep_quality: { type: Number, required: true, min: 0, max: 10 },
      }
    ],
    default: []
  }
});

module.exports = mongoose.model("sleep_and_fatigue", sleepAndFatigueSchema);