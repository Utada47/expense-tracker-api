const request = require('supertest');
const app = require('../src/index');
const { getAuthHeaders } = require('./authHelper');

describe('POST /expenses/import robustness', () => {
  it('skips empty and malformed rows instead of crashing', async () => {
    const headers = await getAuthHeaders();
    const csv =
      'id,amount,description,category,date\n' +
      '1,25,Coffee,Food,2026-01-01\n' +
      '\n' +
      '2,not-a-number,BadAmount,Food,2026-01-01\n';

    const res = await request(app).post('/expenses/import').set(headers).send({ csv });

    expect(res.status).toBe(201);
    expect(res.body.imported).toBe(1);
  });
});
