import express from "express";
import generateAccessAndReferenceToken from "../controllers/authController.js";

const router = express.Router();

router.route("/refresh-token").post(generateAccessAndReferenceToken);

export default router;
