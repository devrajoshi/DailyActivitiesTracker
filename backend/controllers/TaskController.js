import Task from "../models/Task.js";
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
        message: "Start time must be before end time",
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
    const {
      name,
      description,
      priority,
      time_estimate,
      recurrence,
      // custom_recurrence,
    } = req.body;

    // Find and update the task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        priority,
        time_estimate,
        recurrence,
        // custom_recurrence,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
