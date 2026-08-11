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
  let results = store.getAll();

  if (category) {
    const normalized = category.toLowerCase();
    results = results.filter((e) => e.category.toLowerCase() === normalized);
  }

  results = results
    .slice()
    .sort((a, b) =>
      order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );

  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + Number(limit));

  res.json(paginated);
});

router.get('/summary', (req, res) => {
  res.json(buildSummary(store.getAll()));
});

router.get('/summary/monthly', (req, res) => {
  res.json(buildMonthlySummary(store.getAll()));
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
