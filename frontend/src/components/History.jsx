// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { isAuthenticated } from "../utils/auth";
// import TaskTrendChart from "./TaskTrendChart";

// const API_URL = import.meta.env.VITE_API_URL;;

// const History = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     fromDate: "",
//     toDate: "",
//   });

//   // Fetch history from the backend
//   const fetchHistory = async () => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${API_URL}/api/history`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           params: filters,
//         }
//       );

//       setTasks(response.data);
//     } catch (error) {
//       console.error("Error fetching history:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated()) {
//       fetchHistory();
//     }
//   }, []);

//   // Handle date filter changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

//   // Apply filters and fetch updated history
//   const applyFilters = () => {
//     fetchHistory();
//   };

//   if (loading) {
//     return <p className="text-center">Loading...</p>;
//   }

//   return (
//     <div className="w-9/10 md:w-3/4 max-w-2xl mx-auto m-6 p-6 bg-white rounded-lg shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
//       {/* Filters */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">
//           Filter History
//         </h2>
//         <div className="flex space-x-4">
//           <input
//             type="date"
//             name="fromDate"
//             value={filters.fromDate}
//             onChange={handleFilterChange}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={filters.toDate}
//             onChange={handleFilterChange}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           />
//           <button
//             onClick={applyFilters}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div>

//       {/* History List */}
//       <div>
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">
//           Task History
//         </h2>

//         {/* Task Trend Chart */}
//         <TaskTrendChart />

//         {tasks.length === 0 ? (
//           <p className="text-center text-gray-500">No tasks found.</p>
//         ) : (
//           <ul className="space-y-4">
//             {tasks.map((task) => (
//               <li
//                 key={task._id}
//                 className="p-4 bg-gray-100 rounded-md"
//               >
//                 <p className="font-semibold text-gray-900">
//                   {task.title}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Status: {task.status} | Created:{" "}
//                   {new Date(task.createdAt).toLocaleDateString()}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default History;
