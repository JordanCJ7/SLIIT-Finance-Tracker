const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;  // Ensure mongoServer is in the global scope

// Function to connect to the database
const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    // Use in-memory MongoDB server for testing
    mongoServer = await MongoMemoryServer.create();  // This will define mongoServer
    const mongoUri = mongoServer.getUri();

    try {
      await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected to In-Memory DB for Testing`);
    } catch (err) {
      console.error(`MongoDB Connection Error: ${err.message}`);
      process.exit(1); // Exit process with failure
    }
  } else {
    // Use the actual MongoDB URI in non-test environments
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
      console.error(`MongoDB Connection Error: ${err.message}`);
      process.exit(1);
    }
  }
};

// Export the connection function and any necessary cleanup
module.exports = connectDB;
