const request = require('supertest');
const app = require('../../server'); // Adjust the path to your server.js file

describe('Injection Protection', () => {
    it('should prevent NoSQL injection', async () => {
        const res = await request(app).post('/api/auth/login').send({ email: { "$gt": "" }, password: "hack" });
        expect(res.status).toBe(400);
    }, 10000); // Increase the timeout here to 10 seconds
    
    it('should prevent SQL injection', async () => {
        const res = await request(app).post('/api/auth/login').send({ email: "test' OR '1'='1", password: "hack" });
        expect(res.status).toBe(400);
    }, 10000);
    
    it('should prevent command injection', async () => {
        const res = await request(app).post('/api/auth/login').send({ email: "user@example.com; rm -rf /", password: "hack" });
        expect(res.status).toBe(400);
    }, 10000);
});
