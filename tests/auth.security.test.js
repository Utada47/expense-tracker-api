const request = require('supertest');
const app = require('../src/index');
const userStore = require('../src/userStore');

describe('POST /auth/register security', () => {
  it('does not store the password in plain text', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'plaintext-check@example.com', password: 'supersecret123' });

    const user = userStore.findByEmail('plaintext-check@example.com');
    expect(user.password_hash).not.toBe('supersecret123');
  });
});
