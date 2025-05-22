const Seizure = require('../models/seizure');

/**
 * Returns an array of unique seizure dates (as ISO strings) for a given user.
 * @param {String} userId - The user's MongoDB _id.
 * @returns {Promise<string[]>} - Array of unique seizure dates (YYYY-MM-DD).
 */
async function getPastSeizureDays(userId) {
  // Find all seizures for the user, only select seizure_day
  const seizures = await Seizure.find({ userId }).select('seizure_day -_id');

  // Map to date strings (YYYY-MM-DD)
  const dateStrings = seizures
    .map(s => s.seizure_day && s.seizure_day.toISOString().split('T')[0])
    .filter(Boolean);

  // Remove duplicates using a Set
  const uniqueDates = Array.from(new Set(dateStrings));

  return uniqueDates;
}

module.exports = getPastSeizureDays;