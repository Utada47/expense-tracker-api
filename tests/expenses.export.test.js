const request = require('supertest');
const app = require('../src/index');

const headers = { 'x-api-key': process.env.API_KEY };

describe('GET /expenses/export', () => {
  it('returns CSV content, not a single expense lookup', async () => {
    const res = await request(app).get('/expenses/export').set(headers);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/csv/);
  });
});
