process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');

const testDbFile = path.join(__dirname, '..', 'data', 'expenses.test.db');
if (fs.existsSync(testDbFile)) fs.unlinkSync(testDbFile);

const store = require('../src/store');

const TEST_USER_ID = 999;

describe('store (SQLite layer)', () => {
  it('adds and retrieves an expense scoped to a user', () => {
    const created = store.add({
      amount: 20,
      description: 'Taxi',
      category: 'Transport',
      date: new Date().toISOString(),
      userId: TEST_USER_ID,
    });
    const found = store.getByIdForUser(created.id, TEST_USER_ID);

    expect(found).toBeTruthy();
    expect(found.description).toBe('Taxi');
  });

  it('updates an expense', () => {
    const created = store.add({
      amount: 5,
      description: 'Snack',
      category: 'Food',
      date: new Date().toISOString(),
      userId: TEST_USER_ID,
    });
    const updated = store.update(created.id, TEST_USER_ID, { amount: 8 });

    expect(updated.amount).toBe(8);
  });

  it('removes an expense', () => {
    const created = store.add({
      amount: 1,
      description: 'Temp',
      category: 'Misc',
      date: new Date().toISOString(),
      userId: TEST_USER_ID,
    });
    const removed = store.remove(created.id, TEST_USER_ID);

    expect(removed).toBe(true);
    expect(store.getByIdForUser(created.id, TEST_USER_ID)).toBeUndefined();
  });
});
