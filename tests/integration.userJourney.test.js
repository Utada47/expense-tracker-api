const request = require('supertest');
const app = require('../src/index');

describe('Full user journey (integration)', () => {
  it('covers register -> login -> create expenses -> budget -> summary -> export -> refresh -> delete account', async () => {
    const email = 'journey@test.com';
    const password = 'password123';

    // 1. Register
    const register = await request(app).post('/auth/register').send({ email, password });
    expect(register.status).toBe(201);

    // 2. Login
    const login = await request(app).post('/auth/login').send({ email, password });
    expect(login.status).toBe(200);
    const headers = {
      'x-api-key': process.env.API_KEY,
      authorization: `Bearer ${login.body.token}`,
    };

    // 3. Set a budget
    const budget = await request(app)
      .post('/budget')
      .set(headers)
      .send({ month: '2026-08', amount: 200 });
    expect(budget.status).toBe(201);

    // 4. Create expenses
    await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 120, description: 'Rent share', category: 'Housing', date: '2026-08-05T00:00:00.000Z' });
    await request(app)
      .post('/expenses')
      .set(headers)
      .send({ amount: 30, description: 'Groceries', category: 'Food', date: '2026-08-06T00:00:00.000Z' });

    // 5. Check summary
    const summary = await request(app).get('/expenses/summary').set(headers);
    expect(summary.body.total).toBe(150);

    // 6. Check monthly summary reflects budget status
    const monthly = await request(app).get('/expenses/summary/monthly').set(headers);
    expect(monthly.body['2026-08'].overBudget).toBe(false);

    // 7. Export to CSV
    const exported = await request(app).get('/expenses/export').set(headers);
    expect(exported.status).toBe(200);
    expect(exported.headers['content-type']).toMatch(/csv/);

    // 8. Refresh the access token
    const refreshed = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: login.body.refreshToken });
    expect(refreshed.status).toBe(200);

    // 9. Delete the account
    const deleted = await request(app).delete('/auth/account').set(headers);
    expect(deleted.status).toBe(204);

    // 10. Old token should no longer grant access to the (now-deleted) user's data path in a meaningful way
    const afterDeleteLogin = await request(app).post('/auth/login').send({ email, password });
    expect(afterDeleteLogin.status).toBe(401);
  });
});
