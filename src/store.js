const db = require('./db');

function getAll({ category, order = 'desc', limit, offset } = {}) {
  let sql = 'SELECT * FROM expenses';
  const params = [];

  if (category) {
    sql += ' WHERE LOWER(category) = LOWER(?)';
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
    'INSERT INTO expenses (amount, description, category, date) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(expense.amount, expense.description, expense.category, expense.date);
  return getById(info.lastInsertRowid);
}

function getById(id) {
  return db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
}

function update(id, data) {
  const existing = getById(id);
  if (!existing) return null;

  const merged = { ...existing, ...data };
  db.prepare(
    'UPDATE expenses SET amount = ?, description = ?, category = ?, date = ? WHERE id = ?'
  ).run(merged.amount, merged.description, merged.category, merged.date, id);

  return getById(id);
}

function remove(id) {
  const info = db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
  return info.changes > 0;
}

module.exports = { getAll, add, getById, update, remove };
