const request = require('supertest');
const app = require('../src/index');
const { getAuthHeaders } = require('./authHelper');

describe('POST /auth/change-password security', () => {
  it('rejects the request when currentPassword is wrong', async () => {
    const headers = await getAuthHeaders();

    const res = await request(app)
      .post('/auth/change-password')
      .set(headers)
      .send({ currentPassword: 'totally-wrong-password', newPassword: 'newpassword123' });

    expect(res.status).toBe(401);
  });
});
