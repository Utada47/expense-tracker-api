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

module.exports = db;
