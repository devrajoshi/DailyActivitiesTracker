import express from "express";
import {
  getUsers,
  getSpecificUser,
  updateProfile,
  changePassword,
  registerUser,
  loginUser,
} from "../controllers/UserController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.route("/").get(getUsers); // Get all users (optional, depending on your app)
router.route("/register").post(registerUser); // Register a new user
router.route("/login").post(loginUser); // Login a user

// Protected Routes
router.route("/me").get(protect, getSpecificUser); // Get authenticated user's details
// router.route("/me").put(protect, updateSpecificUser); // Update authenticated user's details
// router.route("/refresh-token").post(protect, refreshToken); // Refresh authentication token
router.route("/profile").put(protect, updateProfile); // Update authenticated user's details
router.route("/profile/change-password").put(protect, changePassword); // Update authenticated user's details

export default router;
