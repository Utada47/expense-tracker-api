const request = require('supertest');
const app = require('../src/index');

const headers = { 'x-api-key': process.env.API_KEY };

describe('GET /expenses/summary/monthly', () => {
  it('groups totals by month', async () => {
    await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 40, description: 'Groceries', category: 'Food' });

    const res = await request(app).get('/expenses/summary/monthly').set(headers);

    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
  });
});
