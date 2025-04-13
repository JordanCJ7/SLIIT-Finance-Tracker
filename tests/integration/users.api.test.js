const request = require('supertest');
const app = require('../../server');  // Assuming server.js is the entry point
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');  // Import User model

let mongoServer;

// This will run before all tests to set up the in-memory MongoDB instance
beforeAll(async () => {
    // If there is no active connection, create a new in-memory server
    if (mongoose.connection.readyState === 0) {
        mongoServer = await MongoMemoryServer.create();  // Create a new in-memory MongoDB server
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });  // Connect to the in-memory DB
    }
});

// This will run after all tests to close the MongoDB connection and stop the in-memory server
afterAll(async () => {
    // Ensure mongoServer is initialized before calling stop
    if (mongoServer) {
        await mongoose.disconnect();
        await mongoServer.stop();  // Stop the in-memory MongoDB server
    }
});

describe('User API', () => {
    jest.setTimeout(10000);  // Increase timeout to allow the server more time

    it('should register a user and return a token', async () => {
        const userData = {
            name: 'John Cena',
            email: 'johncena@example.com',
            password: '123'
        };

        const res = await request(app).post('/api/auth/register').send(userData);

        // Check that the response status is OK
        expect(res.status).toBe(200);

        // Check that the response contains a token
        expect(res.body).toHaveProperty('token');

        // Optionally, you can also check that the token is a valid JWT
        const token = res.body.token;
        expect(token).toMatch(/^([A-Za-z0-9-._~+\/=]){1,}$/);  // Basic regex to check if it's a valid JWT

        // Optionally check that the user data (except password) is not returned
        expect(res.body).not.toHaveProperty('password');
    });

    it('should not register a user with an existing email', async () => {
        const userData = {
            name: 'John Cena',
            email: 'johncena@example.com',
            password: '123'
        };

        // First, register the user
        await request(app).post('/api/auth/register').send(userData);

        // Try to register again with the same email
        const res = await request(app).post('/api/auth/register').send(userData);

        // Expect a 400 error as the email already exists
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should login the user and return a token', async () => {
        const userData = {
            name: 'John Cena',
            email: 'johncena@example.com',
            password: '123'
        };

        // First, register the user
        await request(app).post('/api/auth/register').send(userData);

        // Now, try to login
        const res = await request(app).post('/api/auth/login').send({
            email: userData.email,
            password: userData.password
        });

        // Check that the response status is OK
        expect(res.status).toBe(200);

        // Check that the response contains a token
        expect(res.body).toHaveProperty('token');

        // Optionally check that the token is a valid JWT
        const token = res.body.token;
        expect(token).toMatch(/^([A-Za-z0-9-._~+\/=]){1,}$/);  // Basic regex to check if it's a valid JWT
    });

    it('should not login a user with incorrect credentials', async () => {
        const userData = {
            name: 'John Cena',
            email: 'johncena@example.com',
            password: '123'
        };

        // Register the user first
        await request(app).post('/api/auth/register').send(userData);

        // Try to login with incorrect password
        const res = await request(app).post('/api/auth/login').send({
            email: userData.email,
            password: 'wrongpassword'
        });

        // Expect a 400 error as the credentials are incorrect
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
});
