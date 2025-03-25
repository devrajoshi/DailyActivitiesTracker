import Task from "../models/Task.js";
import mongoose from "mongoose";
import TaskCompletion from "../models/TaskCompletion.js";

const createTask = async (req, res) => {
  try {
    const { name, description, priority, start_time, end_time, recurrence } =
      req.body;

    // Validate required fields
    if (!name || !start_time || !end_time) {
      return res.status(400).json({
        message: "Task name, start time, and end time are required",
      });
    }

    // Ensure start_time is before end_time
    if (new Date(start_time) >= new Date(end_time)) {
      return res.status(400).json({
        message:
          "Time is overlapping with other tasks. You have other tasks to do at this time interval.",
      });
    }

    // Check for overlapping time intervals
    const overlappingTask = await Task.findOne({
      user_id: req.user._id,
      $or: [
        {
          start_time: { $lt: end_time },
          end_time: { $gt: start_time },
        },
        {
          start_time: { $gte: start_time, $lt: end_time },
        },
        {
          end_time: { $gt: start_time, $lte: end_time },
        },
      ],
    });

    if (overlappingTask) {
      return res.status(400).json({
        message: "This task overlaps with an existing task",
      });
    }

    // Create the task
    const newTask = new Task({
      user_id: req.user._id,
      name,
      description,
      priority,
      start_time,
      end_time,
      recurrence,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTasks = async (req, res) => {
  try {
    // Access the user's ID from req.user._id
    const tasks = await Task.find({ user_id: req.user._id }).sort({
      created_at: -1,
    });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { _id } = req.params; // Correct destructuring
    const { name, description, priority, start_time, end_time, recurrence } =
      req.body;

    // console.log("Received task ID:", _id); // debugging
    // console.log("Request body:", req.body);

    // Validate taskId format
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      console.error("Invalid task ID format:", _id);
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Check if task exists
    const taskExists = await Task.findById(_id);
    if (!taskExists) {
      console.error("Task not found for ID:", _id);
      return res.status(404).json({ message: "Task not found" });
    }

    // Convert start_time and end_time to Date objects with today's date
    const today = new Date().toISOString().split("T")[0]; // e.g., "2025-03-22"
    const newStartTime = new Date(`${today}T${start_time}:00Z`);
    const newEndTime = new Date(`${today}T${end_time}:00Z`);

    // Validate that end_time is after start_time
    if (newEndTime <= newStartTime) {
      return res.status(400).json({
        message:
          "You have another task to do at this time interval. Please pick your free time for this task.",
      });
    }

    // Check for overlapping tasks (excluding the current task)
    const userId = taskExists.user_id; // Get the user_id from the existing task
    const overlappingTasks = await Task.find({
      user_id: userId,
      _id: { $ne: _id }, // Exclude the task being updated
      $or: [
        {
          start_time: { $lt: newEndTime },
          end_time: { $gt: newStartTime },
        },
      ],
    });

    if (overlappingTasks.length > 0) {
      console.error("Time overlap detected with tasks:", overlappingTasks);
      return res.status(400).json({
        message: "Task time overlaps with an existing task",
        overlappingTasks: overlappingTasks.map((task) => ({
          _id: task._id,
          name: task.name,
          start_time: task.start_time,
          end_time: task.end_time,
        })),
      });
    }

    // Prepare updated data
    const updatedData = {
      name,
      description,
      priority,
      start_time: newStartTime,
      end_time: newEndTime,
      recurrence,
    };

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(_id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error while updating task" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { _id } = req.params; // Align with router.route("/:_id")

    // Validate taskId format
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      console.error("Invalid task ID format:", _id);
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const deletedTask = await Task.findByIdAndDelete(_id);

    if (!deletedTask) {
      console.error("Task not found for ID:", _id);
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};

const markTaskAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    // Check if the task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the task is already marked as completed for the given date
    const existingCompletion = await TaskCompletion.findOne({
      task_id: id,
      user_id: req.user._id,
      date,
    });

    if (existingCompletion && existingCompletion.status === "Completed") {
      return res
        .status(400)
        .json({ message: "Task already marked as completed" });
    }

    // Create or update the completion record
    const completionRecord = await TaskCompletion.findOneAndUpdate(
      { task_id: id, user_id: req.user._id, date },
      {
        status: "Completed",
        completed_at: Date.now(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json(completionRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// To get the past history with tasks completion status
const getTaskHistory = async (req, res) => {
  try {
    const history = await TaskCompletion.find({
      user_id: req.user._id,
    })
      .populate("task_id", "name")
      .sort({ date: -1 });

    res.status(200).json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  markTaskAsCompleted,
  getTaskHistory,
};
