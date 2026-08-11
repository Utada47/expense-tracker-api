const request = require('supertest');
const app = require('../src/index');

describe('CORS', () => {
  it('includes Access-Control-Allow-Origin header on responses', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });
});
