import express from "express";
import protect from "../middleware/authMiddleware.js";
import UserRouter from "./UserRouter.js";
import TaskRouter from "./TaskRouter.js";
import ProfilePictureRouter from "./ProfilePictureRouter.js";
import authRoutes from "./authRoutes.js"; // Import the auth routes
// import productivityRoutes from "./productivityRoutes.js"; // Import the productivity routes

const router = express.Router();

router.use("/users", UserRouter); // Registration and login routes
router.use("/tasks", protect, TaskRouter); // Protect all task-related routes
router.use("/users/profile", protect, ProfilePictureRouter); // Profile-related routes
router.use("/auth", protect, authRoutes); // Authentication routes
// router.use("/productivity", protect, productivityRoutes); // Productivity-related routes

export default router;
