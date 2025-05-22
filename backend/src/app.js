const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const seizureRoutes = require("./routes/seizureRoutes");
const sleepAndFatigueRoutes = require("./routes/sleepAndFatigueRoutes");
const physicalActivityRoutes = require("./routes/physicalActivityRoutes");
const mentalHealthRoutes = require("./routes/mentalHealthRoutes");
const menstrualCycleRoutes = require("./routes/menstrualCycleRoutes");
const medicationAdherenceRoutes = require("./routes/medicationAdherenceRoutes"); // Import medication adherence routes
const foodAndDietRoutes = require("./routes/foodAndDietRoutes"); // Import food and diet routes
const alcoholAndSubstanceUseRoutes = require("./routes/alcoholAndSubstanceUseRoutes"); // Import alcohol and substance use routes
const logsByDayRoutes = require('./routes/LogsByDayRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes); // User routes
app.use("/api/seizures", seizureRoutes); // Seizure routes
app.use("/api/sleep-and-fatigue", sleepAndFatigueRoutes); // Sleep and fatigue routes
app.use("/api/physical-activity", physicalActivityRoutes); // Physical activity routes
app.use("/api/mental-health", mentalHealthRoutes); // Mental health routes
app.use("/api/menstrual-cycle", menstrualCycleRoutes); // Menstrual cycle routes
app.use("/api/medication-adherence", medicationAdherenceRoutes); // Medication adherence routes
app.use("/api/food-and-diet", foodAndDietRoutes); // Food and diet routes
app.use("/api/alcohol-and-substance-use", alcoholAndSubstanceUseRoutes); // Alcohol and substance use routes
app.use('/api/logs', logsByDayRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Export the app
module.exports = app;