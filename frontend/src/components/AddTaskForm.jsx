import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

const AddTaskForm = ({ onClose, onTaskAdded, task }) => {
  // Initialize form state based on whether we're editing or adding a task
  const [formData, setFormData] = useState({
    name: task?.name || "",
    description: task?.description || "",
    priority: task?.priority || "Medium",
    start_time: task?.start_time || "", // Pre-fill start_time
    end_time: task?.end_time || "", // Pre-fill end_time
    recurrence: task?.recurrence || "Daily",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate time inputs to prevent NaN:NaN errors
    if (
      (name === "start_time" || name === "end_time") &&
      value.match(/^\d{2}:\d{2}$/)
    ) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name !== "start_time" && name !== "end_time") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (task) {
        // Update an existing task
        await axios.put(`API_URL/api/tasks/${task._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task updated successfully!");
      } else {
        // Create a new task
        await axios.post(`API_URL/api/tasks`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task added successfully!");
      }

      // Reset the form state
      setFormData({
        name: "",
        description: "",
        priority: "Medium",
        start_time: "",
        end_time: "",
        recurrence: "Daily",
      });

      // Close the modal
      onClose();

      // Trigger the parent callback to refresh the task list
      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(task ? "Failed to update task" : "Failed to add task");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Task Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Task Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter task name"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Task Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Start Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Time
        </label>
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* End Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Time
        </label>
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Recurrence */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Recurrence
        </label>
        <select
          name="recurrence"
          value={formData.recurrence}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Custom">Custom</option>
          <option value="None">None</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
      >
        {task ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default AddTaskForm;
