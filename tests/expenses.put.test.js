const request = require('supertest');
const app = require('../src/index');
const { getAuthHeaders } = require('./authHelper');

describe('PUT /expenses/:id', () => {
  it('rejects an update with an invalid amount type', async () => {
    const headers = await getAuthHeaders();
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
