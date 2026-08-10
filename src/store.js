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

module.exports = { getAll, add, getById };
