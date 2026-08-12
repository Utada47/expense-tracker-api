const Database = require('better-sqlite3');
const path = require('path');

const DB_FILE = path.join(
  __dirname,
  '..',
  'data',
  process.env.NODE_ENV === 'test' ? 'expenses.test.db' : 'expenses.db'
);

const db = new Database(DB_FILE);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'uncategorized',
    date TEXT NOT NULL
  )
`);

module.exports = db;
