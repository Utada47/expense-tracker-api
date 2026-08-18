const request = require('supertest');
const app = require('../src/index');
const db = require('../src/db');

describe('DELETE /auth/account cascade behavior', () => {
  it('removes the user\'s expenses when the account is deleted', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'cascadetest@test.com', password: 'password123' });

    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'cascadetest@test.com', password: 'password123' });

    const headers = { 'x-api-key': process.env.API_KEY, authorization: `Bearer ${login.body.token}` };

    const created = await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 50, description: 'Should be removed with account' });

    await request(app).delete('/auth/account').set(headers);

    const orphan = db.prepare('SELECT * FROM expenses WHERE id = ?').get(created.body.id);
    expect(orphan).toBeUndefined();
  });
});
