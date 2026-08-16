const crypto = require('crypto');
const db = require('./db');

const TOKEN_TTL_MINUTES = 30;

function createResetToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000).toISOString();

  db.prepare('INSERT INTO password_reset_tokens (token, user_id, expires_at) VALUES (?, ?, ?)').run(
    token,
    userId,
    expiresAt
  );

  return token;
}

function findValidToken(token) {
  const row = db.prepare('SELECT * FROM password_reset_tokens WHERE token = ?').get(token);
  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) return null;
  return row;
}

function deleteToken(token) {
  db.prepare('DELETE FROM password_reset_tokens WHERE token = ?').run(token);
}

module.exports = { createResetToken, findValidToken, deleteToken };
