const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { signupUser, loginUser, getMe } = require('./controllers/authController');
const { getJobs, getJobStats, getReminders, createJob, updateJob, deleteJob, setReminder } = require('./controllers/jobController');
const { protect } = require('./middleware/authMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Routes directly defined here or in separate files
const authRouter = express.Router();
authRouter.post('/signup', signupUser);
authRouter.post('/login', loginUser);
authRouter.get('/me', protect, getMe);

const jobRouter = express.Router();
// IMPORTANT: /stats and /reminders must come before /:id otherwise they resolve as ID logic
jobRouter.route('/stats').get(protect, getJobStats);
jobRouter.route('/reminders').get(protect, getReminders);

jobRouter.route('/')
  .get(protect, getJobs)
  .post(protect, createJob);
  
jobRouter.route('/:id')
  .put(protect, updateJob)
  .delete(protect, deleteJob);
  
jobRouter.route('/:id/reminder')
  .put(protect, setReminder);

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('API is running...');
});

// Post-route Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
