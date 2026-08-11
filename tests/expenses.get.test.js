const request = require('supertest');
const app = require('../src/index');

const headers = { 'x-api-key': process.env.API_KEY };

describe('GET /expenses', () => {
  it('returns a list of expenses', async () => {
    await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 10, description: 'Snack' });

    const res = await request(app).get('/expenses').set(headers);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('filters expenses by category', async () => {
    await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 50, description: 'Bus ticket', category: 'Transport' });

    const res = await request(app).get('/expenses?category=Transport').set(headers);

    expect(res.status).toBe(200);
    expect(res.body.every((e) => e.category.toLowerCase() === 'transport')).toBe(true);
  });
});
