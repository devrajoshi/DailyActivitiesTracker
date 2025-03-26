import React, { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TaskTrendChart = () => {
  const [chartData, setChartData] = useState({
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [],
  });

  // Fetch historical data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("/api/history");
        const history = response.data.history;

        // Prepare chart data
        const labels = history.map((entry) => entry.date);
        const completedTasks = history.map((entry) => entry.completedTasks);
        const pendingTasks = history.map((entry) => entry.pendingTasks);

        setChartData({
          labels,
          datasets: [
            {
              label: "Completed Tasks",
              data: completedTasks,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Pending Tasks",
              data: pendingTasks,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="w-9/10 md:w-3/4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Task Trends</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false, // Prevents the chart from resizing uncontrollably
          scales: {
            x: { grid: { display: false } },
            y: { grid: { display: false } },
          },
        }}
        style={{ maxHeight: "400px", width: "100%" }} // Limit chart height
      />
    </div>
  );
};

export default TaskTrendChart;
