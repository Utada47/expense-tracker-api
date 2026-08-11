const request = require('supertest');
const app = require('../src/index');

const headers = { 'x-api-key': process.env.API_KEY };

describe('PUT /expenses/:id', () => {
  it('rejects an update with an invalid amount type', async () => {
    const created = await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 15, description: 'Book' });

    const res = await request(app)
      .put(`/expenses/${created.body.id}`)
      .set(headers)
      .send({ amount: 'not-a-number' });

    expect(res.status).toBe(400);
  });
});
