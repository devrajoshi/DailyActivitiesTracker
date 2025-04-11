// import express from "express";
// import protect from "../middleware/authMiddleware.js";
// const router = express.Router();
// import UserProductivity from "../models/UserProductivity.js"; // Import the UserProductivity model

// // GET /api/productivity/:userId
// // Fetch productivity data for a specific user
// router.get("/:userId", protect, async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Ensure the authenticated user matches the requested userId
//     if (req.userId !== userId) {
//       return res
//         .status(403)
//         .json({ error: "Forbidden. You can only access your own data." });
//     }

//     // Fetch productivity data for the past 30 days
//     const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//     const data = await UserProductivity.find({
//       userId,
//       date: { $gte: thirtyDaysAgo },
//     }).sort({ date: 1 });

//     // Transform data into the desired format
//     const transformedData = data.map((entry) => ({
//       date: entry.date.toISOString().split("T")[0], // Format as YYYY-MM-DD
//       totalTasks: entry.totalTasks,
//       completedTasks: entry.completedTasks,
//       completionPercentage: (
//         (entry.completedTasks / entry.totalTasks) *
//         100
//       ).toFixed(2),
//     }));

//     res.json({ userId, data: transformedData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch productivity data." });
//   }
// });

// export default router;
