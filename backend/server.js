import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/index.js";

const app = express(); // initialize a express app

app.use(cors()); // enable cors for all the routes
app.use(express.json()); // Parse incoming json requests
dotenv.config(); // Loads environment variables from .env file

connectDB(); // Creating database connection

app.use("/api", router); // load all the routes 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});
