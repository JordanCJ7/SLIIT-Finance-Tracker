jest.setTimeout(20000); // Increase timeout for this test

const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');
const User = require('../../models/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Transaction API', () => {
  let userId;
  let mongoServer;
  let mongoUri;

  beforeAll(async () => {
    console.log("Setting up in-memory DB...");

    // Initialize the in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri(); // Get the URI for in-memory MongoDB

    // Ensure we are not already connected before connecting
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    // Create a user in the in-memory DB before the tests
    const user = new User({ name: 'Test User', email: 'testuser@example.com', password: 'password' });
    const savedUser = await user.save();
    userId = savedUser._id; // Store the user ID for use in the transaction creation

    console.log("User created successfully with ID:", userId);
  });

  it('should create a new transaction', async () => {
    const transactionData = {
      amount: 100,
      category: 'Food',
      type: 'expense',
      currency: 'USD',
      tags: ['groceries', 'dinner'],
      userId: userId  // Include userId in the transaction request
    };

    const res = await request(app).post('/api/transactions').send(transactionData);

    console.log(res.body); // Log the response to help debug if needed

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('amount', transactionData.amount);
    expect(res.body).toHaveProperty('category', transactionData.category);
    expect(res.body).toHaveProperty('type', transactionData.type);
    expect(res.body).toHaveProperty('userId');  // Ensure the userId is present
    expect(res.body).toHaveProperty('createdAt'); // Check if createdAt is included
  });

  afterAll(async () => {
    console.log("Cleaning up...");
    // Ensure all operations are completed before finishing the test suite
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop(); // Don't forget to stop the in-memory MongoDB server
  });
});
