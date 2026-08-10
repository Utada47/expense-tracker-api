// Simple in-memory data store for expenses.
// Will be swapped for persistent storage later.

let expenses = [];
let nextId = 1;

function getAll() {
  return expenses;
}

function add(expense) {
  const newExpense = { id: nextId++, ...expense };
  expenses.push(newExpense);
  return newExpense;
}

function getById(id) {
  return expenses.find((e) => e.id === id);
}

function update(id, data) {
  const expense = getById(id);
  if (!expense) return null;
  Object.assign(expense, data);
  return expense;
}

function remove(id) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return false;
  expenses.splice(index, 1);
  return true;
}

module.exports = { getAll, add, getById, update, remove };
