const request = require('supertest');
const app = require('../src/index');
const db = require('../src/db');

describe('Password reset flow', () => {
  it('resets the password with a valid token and allows login with the new password', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'resetflow@test.com', password: 'oldpassword123' });

    const forgot = await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'resetflow@test.com' });

    const reset = await request(app)
      .post('/auth/reset-password')
      .send({ token: forgot.body.token, newPassword: 'newpassword123' });

    expect(reset.status).toBe(200);

    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'resetflow@test.com', password: 'newpassword123' });

    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty('token');
  });

  it('rejects an expired reset token', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'expiretest2@test.com', password: 'password123' });

    const forgot = await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'expiretest2@test.com' });

    db.prepare("UPDATE password_reset_tokens SET expires_at = '2000-01-01T00:00:00.000Z' WHERE token = ?").run(
      forgot.body.token
    );

    const reset = await request(app)
      .post('/auth/reset-password')
      .send({ token: forgot.body.token, newPassword: 'newpassword123' });

    expect(reset.status).toBe(400);
  });

  it('does not reveal whether an email is registered', async () => {
    const res = await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'never-registered@test.com' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeUndefined();
  });
});
