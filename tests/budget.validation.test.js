const request = require('supertest');
const app = require('../src/index');

const headers = { 'x-api-key': process.env.API_KEY };

describe('POST /budget validation', () => {
  it('rejects a request missing month or amount', async () => {
    const res = await request(app).post('/budget').set(headers).send({});
    expect(res.status).toBe(400);
  });

  it('rejects a non-numeric amount', async () => {
    const res = await request(app)
      .post('/budget')
      .set(headers)
      .send({ month: '2026-08', amount: 'lots' });
    expect(res.status).toBe(400);
  });
});
