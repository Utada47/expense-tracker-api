const crypto = require('crypto');
const db = require('./db');

const REFRESH_TOKEN_TTL_DAYS = 30;

function createRefreshToken(userId) {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  db.prepare('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)').run(
    token,
    userId,
    expiresAt
  );

  return token;
}

function findValidRefreshToken(token) {
  const row = db.prepare('SELECT * FROM refresh_tokens WHERE token = ?').get(token);
  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) return null;
  return row;
}

function revokeRefreshToken(token) {
  db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token);
}

function revokeAllForUser(userId) {
  db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId);
}

module.exports = { createRefreshToken, findValidRefreshToken, revokeRefreshToken, revokeAllForUser };
