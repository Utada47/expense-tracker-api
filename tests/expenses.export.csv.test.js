const request = require('supertest');
const app = require('../src/index');

const headers = { 'x-api-key': process.env.API_KEY };

describe('GET /expenses/export CSV escaping', () => {
  it('wraps fields containing commas in double quotes', async () => {
    await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 12, description: 'Lunch, with friends', category: 'Food' });

    const res = await request(app).get('/expenses/export').set(headers);

    expect(res.text).toContain('"Lunch, with friends"');
  });
});
