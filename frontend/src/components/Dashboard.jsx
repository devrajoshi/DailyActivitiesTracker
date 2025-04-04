import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import AddTaskForm from "./AddTaskForm";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
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

  return (
    <div className="p-8 relative min-h-screen">
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
              <div
                className={`text-xs font-semibold ${getPriorityColor(
                  task.priority
                )}`}
              >
                {formatTime(task.start_time)} - {formatTime(task.end_time)}
              </div>
            </li>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </ul>

      {/* Floating Action Button */}
      <button
        onClick={openModal}
        className="fixed bottom-16 right-16 w-20 h-20 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition duration-300 ease-in-out cursor-pointer"
      >
        <span className="text-3xl">+</span>
      </button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">Create a New Task</h2>
        <AddTaskForm onClose={closeModal} onTaskAdded={fetchTasks} />
      </Modal>
    </div>
  );
};

export default Dashboard;
