const request = require('supertest');
const app = require('../src/index');

describe('POST /auth/register validation', () => {
  it('rejects an invalid email format', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'not-an-email', password: 'validpassword123' });

    expect(res.status).toBe(400);
  });

  it('rejects a password that is too short', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'shortpass@example.com', password: '123' });

    expect(res.status).toBe(400);
  });
});
