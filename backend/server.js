// import express framework to create backend server
const express = require("express");

// import cors(cross-origin resource sharing) for frontend and backend communication
const cors = require("cors");

// load environment variables from .env file
require("dotenv").config();

// here we are importing functions from controllers.js so we don't have to write logic inside routes
const {
  signupUser,
  loginUser,
  getMe,
} = require("./controllers/authController");

// here also same thing importing job functions from job controller
const {
  getJobs,
  getJobStats,
  getReminders,
  createJob,
  updateJob,
  deleteJob,
  setReminder,
} = require("./controllers/jobController");

// here we import JWT authMiddleware function for protection and stores it in protect
const { protect } = require("./middleware/authMiddleware");

// here we import errorMiddleware functions for error handling
const { errorHandler } = require("./middleware/errorMiddleware");

// here the express app instance gets created
const app = express();

// enable frontend and backend communication
app.use(cors());

// it converts request body JSON - JS object
app.use(express.json());

// Routes directly defined here or in separate files
// creates mini-router
const authRouter = express.Router();

// if request POST /api/auth/signup then execute signupUser()
authRouter.post("/signup", signupUser);

// same here
authRouter.post("/login", loginUser);

// Because only logged-in user should access profile.
authRouter.get("/me", protect, getMe);

// Creates mini-router for jobs
const jobRouter = express.Router();
// IMPORTANT: /stats and /reminders must come before /:id otherwise they resolve as ID logic

// protected route to getjobStats
jobRouter.route("/stats").get(protect, getJobStats);
// protected route to getReminders
jobRouter.route("/reminders").get(protect, getReminders);

// this is route chaining
jobRouter
  .route("/")
  // get is return all jobs
  .get(protect, getJobs)
  // post is create new job
  .post(protect, createJob);

// if correct id
jobRouter
  .route("/:id")
  // put is update job
  .put(protect, updateJob)
  // delete is delete job
  .delete(protect, deleteJob);

// set reminder
jobRouter.route("/:id/reminder").put(protect, setReminder);

// this means All auth routes start with: /api/auth
app.use("/api/auth", authRouter);
// this means All auth routes start with: /api/jobs
app.use("/api/jobs", jobRouter);

// Health check endpoint checks if server is alive
app.get("/health", (req, res) => {
  res.status(200).send("API is running...");
});

// Post-route Error Handler , run after routes, middleware must me after routes
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
