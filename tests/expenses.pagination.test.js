const request = require('supertest');
const app = require('../src/index');
const { getAuthHeaders } = require('./authHelper');

describe('GET /expenses pagination metadata', () => {
  it('includes X-Total-Count and X-Total-Pages headers', async () => {
    const headers = await getAuthHeaders();
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/expenses')
        .set(headers)
        .send({ amount: 10, description: `item ${i}` });
    }

    const res = await request(app).get('/expenses?limit=2').set(headers);

    expect(res.headers['x-total-count']).toBe('3');
    expect(res.headers['x-total-pages']).toBe('2');
  });
});
