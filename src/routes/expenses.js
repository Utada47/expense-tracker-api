const express = require('express');
const store = require('../store');
const { buildSummary, buildMonthlySummary } = require('../services/summary');
const { validateExpenseInput, validateExpenseUpdate } = require('../validators/expense');

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  const order = (req.query.order || 'desc').toLowerCase();
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);

  const results = store.getAll({ category, order, limit, offset: (page - 1) * limit });

  res.json(results);
});

router.get('/summary', (req, res) => {
  res.json(buildSummary(store.getAll()));
});

router.get('/summary/monthly', (req, res) => {
  res.json(buildMonthlySummary(store.getAll()));
});

function csvEscape(value) {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

router.get('/export', (req, res) => {
  const all = store.getAll();
  const header = 'id,amount,description,category,date';
  const rows = all.map((e) =>
    [e.id, e.amount, e.description, e.category, e.date].map(csvEscape).join(',')
  );
  const csv = [header, ...rows].join('\n');

  res.header('Content-Type', 'text/csv');
  res.attachment('expenses.csv');
  res.send(csv);
});

router.post('/', (req, res) => {
  const { description, category } = req.body;
  const amount = typeof req.body.amount === 'string' ? Number(req.body.amount) : req.body.amount;

  const validationError = validateExpenseInput({ ...req.body, amount });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const expense = store.add({
    amount,
    description,
    category: category || 'uncategorized',
    date: new Date().toISOString(),
  });
  res.status(201).json(expense);
});

router.get('/:id', (req, res) => {
  const expense = store.getById(Number(req.params.id));
  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.json(expense);
});

router.put('/:id', (req, res) => {
  const validationError = validateExpenseUpdate(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const updated = store.update(Number(req.params.id), req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const deleted = store.remove(Number(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.status(204).send();
});

module.exports = router;
