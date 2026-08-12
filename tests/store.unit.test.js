process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');

const testDbFile = path.join(__dirname, '..', 'data', 'expenses.test.db');
if (fs.existsSync(testDbFile)) fs.unlinkSync(testDbFile);

const store = require('../src/store');

describe('store (SQLite layer)', () => {
  it('adds and retrieves an expense', () => {
    const created = store.add({ amount: 20, description: 'Taxi', category: 'Transport', date: new Date().toISOString() });
    const found = store.getById(created.id);

    expect(found).toBeTruthy();
    expect(found.description).toBe('Taxi');
  });

  it('updates an expense', () => {
    const created = store.add({ amount: 5, description: 'Snack', category: 'Food', date: new Date().toISOString() });
    const updated = store.update(created.id, { amount: 8 });

    expect(updated.amount).toBe(8);
  });

  it('removes an expense', () => {
    const created = store.add({ amount: 1, description: 'Temp', category: 'Misc', date: new Date().toISOString() });
    const removed = store.remove(created.id);

    expect(removed).toBe(true);
    expect(store.getById(created.id)).toBeUndefined();
  });
});
