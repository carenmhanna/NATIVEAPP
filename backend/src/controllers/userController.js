const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Create a new user (Register)
exports.createUser = async (req, res) => {
  const { first_name, last_name, email, password, gender, date_of_birth, phone, seizureTypes, medication } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      gender,
      date_of_birth,
      phone,
      seizureTypes,
      medication,
    });

    await user.save();

    // Return the user and token
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return the user and token
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single user by ID (only if it's their own account)
exports.getUserById = async (req, res) => {
  try {
    // Authorization check
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID (only if it's their own account)
exports.updateUser = async (req, res) => {
  try {
    // Authorization check
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // If password is being updated, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a new medication to the user's medication array
exports.addMedication = async (req, res) => {
  try {
    // Authorization check
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { medication_name, dose, frequency, other_medication_name } = req.body;

    const update = {
      $push: {
        medication: {
          medication_name,
          dose,
          frequency,
          other_medication_name,
        },
      },
    };

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Medication added successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID (only if it's their own account)
exports.deleteUser = async (req, res) => {
  try {
    // Authorization check
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user ("me")
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
