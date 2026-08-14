const request = require('supertest');
const app = require('../src/index');
const { getAuthHeaders } = require('./authHelper');

describe('Data isolation between users', () => {
  it('prevents one user from viewing another user\'s expense', async () => {
    const headersA = await getAuthHeaders();
    const headersB = await getAuthHeaders();

    const created = await request(app)
      .post('/expenses')
      .set(headersA)
      .send({ amount: 99, description: 'Private expense' });

    const res = await request(app).get(`/expenses/${created.body.id}`).set(headersB);

    expect(res.status).toBe(404);
  });

  it('does not include other users\' expenses in the list', async () => {
    const headersA = await getAuthHeaders();
    const headersB = await getAuthHeaders();

    await request(app).post('/expenses').set(headersA).send({ amount: 10, description: 'A only' });

    const res = await request(app).get('/expenses').set(headersB);

    expect(res.body).toEqual([]);
  });
});
