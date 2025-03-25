import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

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

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming auth middleware sets req.user
    const { fullname, username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullname, username, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password and bypass the pre-save middleware
    user.password = newHashedPassword;
    user.skipPasswordHashing = true; // Bypass hashing in middleware
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
      requireReLogin: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      fullname,
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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email (including the password field)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Debugging logs (temporary - remove in production)
    console.log("Stored hash:", user.password);
    console.log("Input password:", password);

    // Direct bcrypt comparison (bypassing model method for debugging)
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return success response with user data (excluding sensitive fields)
    const userData = user.toObject();
    delete userData.password;
    delete userData.__v;

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getUsers,
  getSpecificUser,
  updateProfile,
  changePassword,
  registerUser,
  loginUser,
};
