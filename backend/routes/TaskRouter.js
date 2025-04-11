import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  markTaskAsCompleted,
  // getTaskHistory
} from "../controllers/TaskController.js";

const router = express.Router();

router.route("/").get(getTasks).post(createTask);
router.route("/:_id").put(updateTask).delete(deleteTask);
router.route("/:_id/complete").post(markTaskAsCompleted);
// router.route("/history").get(getTaskHistory);

export default router;
