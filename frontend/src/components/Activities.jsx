import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"; // Import the Axios instance
import { toast } from "react-toastify";
import Modal from "./Modal"; // Assuming you have a Modal component
import AddTaskForm from "./AddTaskForm";
import { refreshAccessToken } from "../utils/auth"; // Import the refreshAccessToken function

const API_URL = import.meta.env.VITE_API_URL;

const Activities = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Helper function to format ISO date into time (HH:mm) for input type="time"
  const formatDateTimeLocal = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");

      // If access accessToken is missing or invalid, attempt to refresh it
      if (!accessToken) {
        accessToken = await refreshAccessToken();
      }

      const response = await axiosInstance.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  // Helper function to format time
  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Helper function for priority-based colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-orange-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Open the modal for adding a new task
  const openAddModal = () => {
    setSelectedTask(null); // No task selected means "add new task"
    setIsModalOpen(true);
  };

  // Open the modal for editing an existing task
  const openEditModal = (task) => {
    if (!task || !task._id) {
      console.error("Invalid task object:", task);
      return toast.error("Failed to load task details");
    }

    // Format the task data to match AddTaskForm expectations
    const formattedTask = {
      ...task,
      start_time: formatDateTimeLocal(task.start_time),
      end_time: formatDateTimeLocal(task.end_time),
    };
    setSelectedTask(formattedTask); // Pass the formatted task to edit
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedTask(null); // Reset selected task
    setIsModalOpen(false);
  };

  // Handle task deletion with custom-styled confirmation toast
  const handleDelete = (taskId, taskName) => {
    toast(
      <div className="w-96 p-6 bg-opacity-70 backdrop-blur-md text-black rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Delete '{taskName}'?</h3>
        <p className="mb-4">Are you sure you want to delete this task?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={async () => {
              try {
                const accessToken = localStorage.getItem("accessToken");
                await axiosInstance.delete(`${API_URL}/api/tasks/${taskId}`, {
                  headers: { Authorization: `Bearer ${accessToken}` },
                });
                toast.dismiss();
                toast.success("Task deleted successfully!");
                fetchTasks(); // Refresh the task list
              } catch (error) {
                console.error("Error deleting task:", error);
                toast.dismiss();
                toast.error("Failed to delete task");
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer"
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        position: "top-center",
        className: "w-96",
        style: { width: "24rem" },
      }
    );
  };

  return (
    <div className="w-9/10 md:w-3/4 max-w-2xl mx-auto m-6 p-6 bg-white rounded-lg shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>

      {/* Task List */}
      <ul className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li
              key={task._id}
              className="bg-gray-200 p-4 rounded-md flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{task.name}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`text-xs font-semibold ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {formatTime(task.start_time)} - {formatTime(task.end_time)}
                </span>
                {/* Edit Icon */}
                <button
                  onClick={() => openEditModal(task)}
                  className="text-indigo-600 hover:text-indigo-700 hover:scale-105 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(task._id, task.name)}
                  className="text-red-600 hover:text-red-700 hover:scale-105 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </ul>

      {/* Floating Action Button */}
      <button
        onClick={openAddModal}
        className="fixed bottom-16 right-16 w-20 h-20 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
      >
        <span className="text-3xl">+</span>
      </button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">
          {selectedTask ? "Edit Task" : "Create a New Task"}
        </h2>
        <AddTaskForm
          onClose={closeModal}
          onTaskAdded={fetchTasks}
          task={selectedTask} // Pass the selected task (or null for adding)
        />
      </Modal>
    </div>
  );
};

export default Activities;
