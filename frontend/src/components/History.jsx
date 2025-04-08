import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Switch } from "@headlessui/react";

const COLORS = {
  green: "#34C759",
  yellow: "#FFCC00",
  red: "#FF3B30",
};

const sampleData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  totalTasks: Math.floor(Math.random() * 10) + 5,
  completedTasks: Math.floor(Math.random() * 10),
}));

const Dashboard = () => {
  const [view, setView] = useState("monthly"); // 'weekly' or 'monthly'

  const calculateCompletionPercentage = (data) =>
    data.map((item) => ({
      ...item,
      completionPercentage: (
        (item.completedTasks / item.totalTasks) *
        100
      ).toFixed(2),
    }));

  const filteredData = view === "weekly" ? sampleData.slice(-7) : sampleData;
  const processedData = calculateCompletionPercentage(filteredData);

  const getFillColor = (percentage) => {
    if (percentage > 80) return COLORS.green;
    if (percentage >= 50 && percentage <= 80) return COLORS.yellow;
    return COLORS.red;
  };

  const averageCompletionRate =
    processedData.reduce(
      (sum, item) => sum + parseFloat(item.completionPercentage),
      0
    ) / processedData.length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Productivity Dashboard
        </h1>
        <Switch.Group>
          <div className="flex items-center">
            <Switch.Label className="mr-2 text-gray-700">Weekly</Switch.Label>
            <Switch
              checked={view === "weekly"}
              onChange={() => setView(view === "weekly" ? "monthly" : "weekly")}
              className={`${
                view === "weekly" ? "bg-blue-600" : "bg-gray-300"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span
                className={`${
                  view === "weekly" ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <Switch.Label className="ml-2 text-gray-700">Monthly</Switch.Label>
          </div>
        </Switch.Group>
      </div>

      {/* Line Chart */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daily Completion Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processedData}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const {
                  date,
                  totalTasks,
                  completedTasks,
                  completionPercentage,
                } = payload[0].payload;
                return (
                  <div className="bg-white p-2 rounded shadow">
                    <p>{date}</p>
                    <p>Total Tasks: {totalTasks}</p>
                    <p>Completed Tasks: {completedTasks}</p>
                    <p>Completion: {completionPercentage}%</p>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="completionPercentage"
              stroke="#8884d8"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, value } = props;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill={getFillColor(value)}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap/Bar Chart */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daily Task Load</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={processedData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalTasks" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Donut Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={[
                { name: "Completed", value: averageCompletionRate },
                { name: "Pending", value: 100 - averageCompletionRate },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {[{ fill: COLORS.green }, { fill: COLORS.red }].map(
                (color, index) => (
                  <Cell key={`cell-${index}`} fill={color.fill} />
                )
              )}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <p className="text-center mt-2">
          Avg Completion Rate: {averageCompletionRate.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
