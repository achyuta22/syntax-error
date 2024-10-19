// userController.js
const User = require("../models/user"); // Import the User model
const bcrypt = require("bcrypt");

// Signup Controller
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
const login = async (req, res) => {
  console.log("hah aha a ha ");
  const { email, password } = req.body;
  console.log(email, password);

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Successful login
    return res
      .status(200)
      .json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signup,
  login,
};
