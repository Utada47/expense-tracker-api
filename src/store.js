const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'expenses.json');

let expenses = [];
let nextId = 1;

function load() {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    expenses = JSON.parse(raw);
    nextId = expenses.reduce((max, e) => Math.max(max, e.id), 0) + 1;
  }
}

function persist() {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
  } catch (err) {
    console.error('Failed to persist expenses to disk:', err.message);
  }
}

function getAll() {
  return expenses;
}

function add(expense) {
  const newExpense = { id: nextId++, ...expense };
  expenses.push(newExpense);
  persist();
  return newExpense;
}

function getById(id) {
  return expenses.find((e) => e.id === id);
}

function update(id, data) {
  const expense = getById(id);
  if (!expense) return null;
  Object.assign(expense, data);
  persist();
  return expense;
}

function remove(id) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return false;
  expenses.splice(index, 1);
  persist();
  return true;
}

load();

module.exports = { getAll, add, getById, update, remove };
