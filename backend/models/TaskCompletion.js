import mongoose from "mongoose";

const taskCompletionSchema = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "almostCompleted", "halfCompleted", "notCompleted"],
      default: "notCompleted",
    },
  },
  { timestamps: true }
);

const TaskCompletion = mongoose.model("TaskCompletion", taskCompletionSchema);

export default TaskCompletion;
