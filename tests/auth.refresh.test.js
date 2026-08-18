const request = require('supertest');
const app = require('../src/index');

describe('Refresh token flow', () => {
  it('issues a refresh token on login and can exchange it for a new access token', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'refreshflow@test.com', password: 'password123' });

    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'refreshflow@test.com', password: 'password123' });

    expect(login.body).toHaveProperty('token');
    expect(login.body).toHaveProperty('refreshToken');

    const refreshed = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: login.body.refreshToken });

    expect(refreshed.status).toBe(200);
    expect(refreshed.body).toHaveProperty('token');

    // The new access token should work for authenticated routes.
    const me = await request(app)
      .get('/auth/me')
      .set({ 'x-api-key': process.env.API_KEY, authorization: `Bearer ${refreshed.body.token}` });

    expect(me.status).toBe(200);
  });

  it('rejects an invalid refresh token', async () => {
    const res = await request(app).post('/auth/refresh').send({ refreshToken: 'not-a-real-token' });
    expect(res.status).toBe(401);
  });

  it('rejects a missing refresh token', async () => {
    const res = await request(app).post('/auth/refresh').send({});
    expect(res.status).toBe(401);
  });
});
