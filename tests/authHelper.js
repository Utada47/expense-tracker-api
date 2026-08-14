const request = require('supertest');
const app = require('../src/index');

let counter = 0;

async function getAuthHeaders() {
  counter += 1;
  const email = `test-user-${Date.now()}-${counter}@example.com`;
  const password = 'testpassword123';

  await request(app).post('/auth/register').send({ email, password });
  const loginRes = await request(app).post('/auth/login').send({ email, password });

  return {
    'x-api-key': process.env.API_KEY,
    authorization: `Bearer ${loginRes.body.token}`,
  };
}

module.exports = { getAuthHeaders };
