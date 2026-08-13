const request = require('supertest');
const app = require('../src/index');

describe('GET /health', () => {
  it('reports database status alongside overall status', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.database).toBe('ok');
  });
});
