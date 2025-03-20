import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({
      created_at: -1,
    });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/me - Fetch the authenticated user's details
const getSpecificUser = async (req, res) => {
  try {
    // The user object is already attached to the request by the protect middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user details as a response
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching user details" });
  }
};

const updateSpecificUser = async (req, res) => {
  try {
    const { name, username, email, country } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, username, email, country },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user details:", error);
    res
      .status(500)
      .json({ message: "Server error while updating user details" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, timezone } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

import jwt from "jsonwebtoken";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expires in 1 day
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getUsers,
  getSpecificUser,
  updateSpecificUser,
  registerUser,
  loginUser,
};
