process.env.API_KEY = process.env.API_KEY || 'test-key';

if (process.env.NODE_ENV === 'test') {
  const fs = require('fs');
  const path = require('path');
  const testDbFile = path.join(__dirname, '..', 'data', 'expenses.test.db');
  for (const suffix of ['', '-wal', '-shm']) {
    const file = testDbFile + suffix;
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}
