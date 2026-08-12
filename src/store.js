const db = require('./db');

function getAll() {
  return db.prepare('SELECT * FROM expenses').all();
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
