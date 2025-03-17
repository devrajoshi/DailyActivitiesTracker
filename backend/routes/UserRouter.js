import express from "express";
import {
  getUsers,
    registerUser,
  loginUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.route("/").get(getUsers);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

export default router;
