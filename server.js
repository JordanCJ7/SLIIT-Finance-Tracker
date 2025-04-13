const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require('./config/db');  // Import the DB connection function
const cron = require('node-cron');

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const notificationRoutes = require('./routes/notifications');
const goalRoutes = require('./routes/goals');
const dashboardRoutes = require("./routes/dashboard");
const reportRoutes = require('./routes/reports');
const authMiddleware = require('./middleware/auth'); 

const { checkDuePayments, checkGoalProgress } = require('./jobs/notifications');

dotenv.config();
const app = express();

// Connect to MongoDB only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware setup
app.use(express.json());  // To parse JSON request bodies
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes setup
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/goals', goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/transactions", authMiddleware, transactionRoutes);

//test
app.use('/api/transactions', (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);  // Log the header
  next();
}, authMiddleware, transactionRoutes);


// Run the jobs at midnight every day (only in non-test environment)
if (process.env.NODE_ENV !== 'test') {
  cron.schedule('0 0 * * *', () => {
      console.log('Running scheduled jobs...');
      checkDuePayments();
      checkGoalProgress();
  });

  // Start the server (only in non-test environment)
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });
}

// Export app for testing to ensure we can call app.listen() in the test environment only if required
module.exports = app;

// Handle DB connection during tests (MongoDB connection setup for testing only)
if (process.env.NODE_ENV === 'test') {
  const mongoose = require('mongoose');

  beforeAll(async () => {
    // Make sure MongoDB is connected before running the tests
    await connectDB();
  });

  afterAll(async () => {
    // Close the connection after tests are completed
    await mongoose.connection.close();
  });
}
