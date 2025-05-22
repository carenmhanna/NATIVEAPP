require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./src/models/user');

async function addUser() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user = new User({
    first_name: "Jane",
    last_name: "Doe",
    gender: "Female",
    menstrualCycleStatus: "Regular",
    date_of_birth: new Date("1990-01-01"),
    email: "jane.doe@example.com",
    password: "securepassword123",
    epilepsy_type: "Focal",
    medication: [
      {
        medication_name: "Lamotrigine 50 mg",
        medication_frequency: 2,
      }
    ]
  });

  try {
    const savedUser = await user.save();
    console.log("User added:", savedUser);
  } catch (err) {
    console.error("Error adding user:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

addUser();