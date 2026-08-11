const request = require('supertest');
const app = require('../src/index');

describe('API key authentication', () => {
  it('rejects requests without an API key', async () => {
    const res = await request(app).get('/expenses');
    expect(res.status).toBe(401);
  });

  it('rejects requests with a wrong API key', async () => {
    const res = await request(app).get('/expenses').set({ 'x-api-key': 'wrong-key' });
    expect(res.status).toBe(401);
  });

  it('allows /health without an API key', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });
});
