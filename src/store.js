const db = require('./db');

function getAll({ userId, category, order = 'desc', limit, offset } = {}) {
  let sql = 'SELECT * FROM expenses WHERE user_id = ?';
  const params = [userId];

  if (category) {
    sql += ' AND LOWER(category) = LOWER(?)';
    params.push(category);
  }

  sql += order === 'asc' ? ' ORDER BY date ASC' : ' ORDER BY date DESC';

  if (limit !== undefined) {
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset || 0);
  }

  return db.prepare(sql).all(...params);
}

function add(expense) {
  const stmt = db.prepare(
    'INSERT INTO expenses (amount, description, category, date, user_id) VALUES (?, ?, ?, ?, ?)'
  );
  const info = stmt.run(
    expense.amount,
    expense.description,
    expense.category,
    expense.date,
    expense.userId
  );
  return getByIdForUser(info.lastInsertRowid, expense.userId);
}

function getByIdForUser(id, userId) {
  return db.prepare('SELECT * FROM expenses WHERE id = ? AND user_id = ?').get(id, userId);
}

function update(id, userId, data) {
  const existing = getByIdForUser(id, userId);
  if (!existing) return null;

  const merged = { ...existing, ...data };
  db.prepare(
    'UPDATE expenses SET amount = ?, description = ?, category = ?, date = ? WHERE id = ? AND user_id = ?'
  ).run(merged.amount, merged.description, merged.category, merged.date, id, userId);

  return getByIdForUser(id, userId);
}

function remove(id, userId) {
  const info = db.prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?').run(id, userId);
  return info.changes > 0;
}

function countAll({ userId, category }) {
  let sql = 'SELECT COUNT(*) as count FROM expenses WHERE user_id = ?';
  const params = [userId];
  if (category) {
    sql += ' AND LOWER(category) = LOWER(?)';
    params.push(category);
  }
  return db.prepare(sql).get(...params).count;
}

module.exports = { getAll, add, getByIdForUser, update, remove, countAll };
