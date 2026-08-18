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

function updatePassword(userId, passwordHash) {
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, userId);
}

function deleteUser(userId) {
  const deleteExpenses = db.prepare('DELETE FROM expenses WHERE user_id = ?');
  const deleteRefreshTokens = db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?');
  const deleteResetTokens = db.prepare('DELETE FROM password_reset_tokens WHERE user_id = ?');
  const deleteUserRow = db.prepare('DELETE FROM users WHERE id = ?');

  const cascade = db.transaction((id) => {
    deleteExpenses.run(id);
    deleteRefreshTokens.run(id);
    deleteResetTokens.run(id);
    deleteUserRow.run(id);
  });

  cascade(userId);
}

module.exports = { createUser, findByEmail, findById, updatePassword, deleteUser };
