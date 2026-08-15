const request = require('supertest');
const app = require('../src/index');
const { getAuthHeaders } = require('./authHelper');

describe('POST /expenses/import', () => {
  it('imports valid rows from CSV', async () => {
    const headers = await getAuthHeaders();
    const csv =
      'id,amount,description,category,date\n' +
      '1,25,Coffee,Food,2026-01-01\n' +
      '2,40,Groceries,Food,2026-01-02\n';

    const res = await request(app).post('/expenses/import').set(headers).send({ csv });

    expect(res.status).toBe(201);
    expect(res.body.imported).toBe(2);

    const list = await request(app).get('/expenses').set(headers);
    expect(list.body.length).toBe(2);
  });

  it('requires a csv field', async () => {
    const headers = await getAuthHeaders();
    const res = await request(app).post('/expenses/import').set(headers).send({});
    expect(res.status).toBe(400);
  });
});
