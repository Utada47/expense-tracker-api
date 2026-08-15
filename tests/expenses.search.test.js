const request = require('supertest');
const app = require('../src/index');
const { getAuthHeaders } = require('./authHelper');

describe('GET /expenses/search', () => {
  it('finds expenses matching the query, case-insensitively', async () => {
    const headers = await getAuthHeaders();
    await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 20, description: 'Grocery Shopping' });
    await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 5, description: 'Movie ticket' });

    const res = await request(app).get('/expenses/search?q=grocery').set(headers);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].description).toBe('Grocery Shopping');
  });

  it('requires a query parameter', async () => {
    const headers = await getAuthHeaders();
    const res = await request(app).get('/expenses/search').set(headers);
    expect(res.status).toBe(400);
  });
});
