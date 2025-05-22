const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import the User model

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const user = await User.findById(decoded.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized, invalid or expired token" });
  }
};