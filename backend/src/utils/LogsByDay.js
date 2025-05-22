const FoodAndDiet = require('../models/food_and_diet');
const SleepAndFatigue = require('../models/sleep_and_fatigue');
const PhysicalActivity = require('../models/physical_activity');
const MentalHealth = require('../models/mental_health');
const MenstrualCycle = require('../models/menstrual_cycle');
const MedicationAdherence = require('../models/medication_adherence');
const AlcoholAndSubstanceUse = require('../models/alcohol_and_substance_use');
// Add more models as needed

async function findLogsByDay(userId, date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const queries = [
    { model: FoodAndDiet, field: 'log_date', name: 'food_and_diet' },
    { model: SleepAndFatigue, field: 'log_date', name: 'sleep_and_fatigue' },
    { model: PhysicalActivity, field: 'log_date', name: 'physical_activity' },
    { model: MentalHealth, field: 'log_date', name: 'mental_health' },
    { model: MenstrualCycle, field: 'log_date', name: 'menstrual_cycle' },
    { model: MedicationAdherence, field: 'log_date', name: 'medication_adherence' },
    { model: AlcoholAndSubstanceUse, field: 'log_date', name: 'alcohol_and_substance_use' },
    // Add more as needed
  ];

  const results = {};

  for (const { model, field, name } of queries) {
    const log = await model.findOne({
      userId,
      [field]: { $gte: start, $lte: end }
    });
    results[name] = !!log; // true if log exists, false otherwise
  }

  return results;
}

module.exports = findLogsByDay;