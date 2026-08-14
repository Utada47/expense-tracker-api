const request = require('supertest');
const app = require('../src/index');
const { getAuthHeaders } = require('./authHelper');

describe('GET /expenses/export', () => {
  it('returns CSV content, not a single expense lookup', async () => {
    const headers = await getAuthHeaders();
    const res = await request(app).get('/expenses/export').set(headers);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/csv/);
  });
});
