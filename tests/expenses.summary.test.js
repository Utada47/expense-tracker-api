const request = require('supertest');
const app = require('../src/index');
const { getAuthHeaders } = require('./authHelper');

describe('GET /expenses/summary', () => {
  it('returns total and count', async () => {
    const headers = await getAuthHeaders();
    await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 30, description: 'Lunch', category: 'Food' });

    const res = await request(app).get('/expenses/summary').set(headers);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('byCategory');
  });
});
