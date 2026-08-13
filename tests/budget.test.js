const request = require('supertest');
const app = require('../src/index');

const headers = { 'x-api-key': process.env.API_KEY };

describe('Budget endpoints', () => {
  it('sets and retrieves a budget for a given month', async () => {
    const created = await request(app)
      .post('/budget')
      .set(headers)
      .send({ month: '2026-09', amount: 500 });

    expect(created.status).toBe(201);

    const fetched = await request(app).get('/budget/2026-09').set(headers);
    expect(fetched.status).toBe(200);
    expect(fetched.body.amount).toBe(500);
  });

  it('returns 404 for a month with no budget set', async () => {
    const res = await request(app).get('/budget/1999-01').set(headers);
    expect(res.status).toBe(404);
  });

  it('flags a month as over budget in the monthly summary', async () => {
    await request(app).post('/budget').set(headers).send({ month: '2026-08', amount: 100 });
    await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 150, description: 'Overspend', category: 'Food', date: '2026-08-01T00:00:00.000Z' });

    const res = await request(app).get('/expenses/summary/monthly').set(headers);

    expect(res.body['2026-08'].overBudget).toBe(true);
  });
});
