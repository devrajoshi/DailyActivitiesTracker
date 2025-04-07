import express from "express";
import refreshAccessToken from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js"; // Middleware to protect routes

const router = express.Router();

router.route("/refresh-token").post(protect, refreshAccessToken); // Refresh authentication token

export default router;
