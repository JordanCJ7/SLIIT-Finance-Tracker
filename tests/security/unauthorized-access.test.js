const request = require('supertest');
const app = require('../../server'); // Path to your app
const jwt = require('jsonwebtoken');

describe('Unauthorized Access', () => {

  it('should fail to access protected route without token', async () => {
    const res = await request(app).get('/api/transactions');  // No Authorization header
    expect(res.status).toBe(401);  // Should return 401 Unauthorized
  });

  it('should fail to access protected route with invalid token', async () => {
    const res = await request(app).get('/api/transactions')
      .set('Authorization', 'Bearer invalid_token');  // Invalid token
    expect(res.status).toBe(401);  // Should return 401 Unauthorized
  });

  it('should fail to access protected route with expired token', async () => {
    const expiredToken = jwt.sign({ userId: 'testUser' }, process.env.JWT_SECRET, { expiresIn: '1s' });

    setTimeout(async () => {
      const res = await request(app).get('/api/transactions')
        .set('Authorization', `Bearer ${expiredToken}`);  // Expired token
      expect(res.status).toBe(401);  // Should return 401 Unauthorized
    }, 2000);  // Wait for 2 seconds for the token to expire
  });
});
