import express from "express";
import {
  getUsers,
  getSpecificUser,
  updateProfile,
  changePassword,
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/UserController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.route("/").get(getUsers); // Get all users (optional, depending on your app)
router.route("/register").post(registerUser); // Register a new user
router.route("/login").post(loginUser); // Login a user
router.route("/logout").post(logoutUser); // Login a user

// Protected Routes
router.route("/me").get(protect, getSpecificUser); // Get authenticated user's details
router.route("/profile").put(protect, updateProfile); // Update authenticated user's details
router.route("/profile/change-password").put(protect, changePassword); // Update authenticated user's details

export default router;
