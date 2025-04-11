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

    // Validate time format (HH:mm)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return res.status(400).json({
        message: "Invalid time format. Use HH:mm (e.g., 08:00)",
      });
    }

    // Convert start_time and end_time to Date objects with today's date
    const today = new Date().toISOString().split("T")[0]; // e.g., "2025-03-22"
    const newStartTime = new Date(`${today}T${start_time}:00Z`);
    const newEndTime = new Date(`${today}T${end_time}:00Z`);

    // Validate that end_time is after start_time
    if (newEndTime <= newStartTime) {
      return res.status(400).json({
        message: "End time must be after start time.",
      });
    }

    // Check for overlapping time intervals
    const overlappingTask = await Task.findOne({
      user_id: req.user._id,
      $or: [
        {
          start_time: { $lt: newEndTime },
          end_time: { $gt: newStartTime },
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
      start_time: newStartTime,
      end_time: newEndTime,
      recurrence,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getTasks = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    // Fetch tasks for the authenticated user
    const tasks = await Task.find({ user_id: req.user._id }).sort({
      created_at: -1,
    });

    return res.status(200).json(tasks);
  } catch (err) {
    console.error("Error in getTasks:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, description, priority, start_time, end_time, recurrence } =
      req.body;

    // Validate task ID format
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Check if task exists
    const existingTask = await Task.findById(_id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Validate time inputs (HH:mm format)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return res
        .status(400)
        .json({ message: "Invalid time format. Use HH:mm" });
    }

    // Create Date objects with original task's date but new times
    const originalStart = existingTask.start_time;
    const newStartTime = new Date(originalStart);
    const [startHours, startMinutes] = start_time.split(":").map(Number);
    newStartTime.setHours(startHours, startMinutes, 0, 0);

    const originalEnd = existingTask.end_time;
    const newEndTime = new Date(originalEnd);
    const [endHours, endMinutes] = end_time.split(":").map(Number);
    newEndTime.setHours(endHours, endMinutes, 0, 0);

    // Validate time logic
    if (newEndTime <= newStartTime) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    // Check for overlapping tasks (same day only)
    const startOfDay = new Date(newStartTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(newStartTime);
    endOfDay.setHours(23, 59, 59, 999);

    const overlappingTasks = await Task.find({
      user_id: existingTask.user_id,
      _id: { $ne: _id },
      start_time: { $gte: startOfDay, $lte: endOfDay },
      $or: [
        {
          start_time: { $lt: newEndTime },
          end_time: { $gt: newStartTime },
        },
      ],
    });

    if (overlappingTasks.length > 0) {
      const formattedOverlaps = overlappingTasks.map((task) => ({
        name: task.name,
        time: `${task.start_time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${task.end_time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      }));
      return res.status(400).json({
        message: "Time overlaps with existing tasks",
        overlaps: formattedOverlaps,
      });
    }

    // Update the task (preserve original date, update times)
    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      {
        name,
        description,
        priority,
        start_time: newStartTime,
        end_time: newEndTime,
        recurrence,
      },
      { new: true, runValidators: true }
    );

    // Format the response times for display
    const responseTask = updatedTask.toObject();
    responseTask.start_time = updatedTask.start_time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    responseTask.end_time = updatedTask.end_time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return res.status(200).json({
      success: true,
      task: responseTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating task",
      error: error.message,
    });
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
    const { _id } = req.params; // Task ID
    const { date } = req.body; // Date for which the task is marked as completed
    const userId = req.user._id; // Authenticated user's ID from authMiddleware

    // Step 1: Check if the task exists
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Step 2: Check if the task is already marked as completed for the given date
    const existingCompletion = await TaskCompletion.findOne({
      task_id: _id,
      user_id: userId,
      date,
    });

    if (existingCompletion && existingCompletion.status === "Completed") {
      return res
        .status(400)
        .json({ message: "Task already marked as completed for this date" });
    }

    // Step 3: Create or update the completion record
    const completionRecord = await TaskCompletion.findOneAndUpdate(
      { task_id: _id, user_id: userId, date },
      {
        status: "Completed",
        completed_at: new Date(),
      },
      { upsert: true, new: true } // Create if it doesn't exist, otherwise update
    );

    res
      .status(200)
      .json({ message: "Task marked as completed", completionRecord });
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
