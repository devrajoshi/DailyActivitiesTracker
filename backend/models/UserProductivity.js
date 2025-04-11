import mongoose from "mongoose";
const userProductivitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  totalTasks: {
    type: Number,
    required: true,
  },
  completedTasks: {
    type: Number,
    required: true,
  },
  completionPercentage: {
    type: Number,
    required: true,
  },
  categories: {
    type: Map,
    of: Number,
    default: {},
  },
  timestamps: {
    type: [Date],
    default: [],
  },
  taskDurations: {
    type: Map,
    of: Number,
    default: {},
  },
});

const UserProductivity = mongoose.model(
  "UserProductivity",
  userProductivitySchema
);

export default UserProductivity;
