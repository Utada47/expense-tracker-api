const db = require('./db');

function setBudget(month, amount) {
  db.prepare(
    'INSERT INTO budgets (month, amount) VALUES (?, ?) ON CONFLICT(month) DO UPDATE SET amount = excluded.amount'
  ).run(month, amount);
  return getBudget(month);
}

function getBudget(month) {
  return db.prepare('SELECT * FROM budgets WHERE month = ?').get(month);
}

module.exports = { setBudget, getBudget };
