const request = require('supertest');
const app = require('../src/index');

describe('POST /expenses', () => {
  it('creates a new expense with valid data', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ amount: 25, description: 'Coffee', category: 'Food' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.description).toBe('Coffee');
  });

  it('rejects a request missing required fields', async () => {
    const res = await request(app).post('/expenses').send({ description: 'No amount' });

    expect(res.status).toBe(400);
  });
});
