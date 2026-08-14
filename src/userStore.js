const db = require('./db');

function createUser(email, passwordHash) {
  const stmt = db.prepare(
    'INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)'
  );
  const info = stmt.run(email, passwordHash, new Date().toISOString());
  return findById(info.lastInsertRowid);
}

function findByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

function findById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

module.exports = { createUser, findByEmail, findById };
