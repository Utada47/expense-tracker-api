const express = require('express');
const store = require('../store');
const budgetStore = require('../budgetStore');
const requireAuth = require('../middleware/requireAuth');
const { buildSummary, buildMonthlySummary } = require('../services/summary');
const { validateExpenseInput, validateExpenseUpdate } = require('../validators/expense');

const router = express.Router();

router.use(requireAuth);

router.get('/', (req, res) => {
  const { category } = req.query;
  const order = (req.query.order || 'desc').toLowerCase();
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);

  const results = store.getAll({
    userId: req.userId,
    category,
    order,
    limit,
    offset: (page - 1) * limit,
  });

  const totalCount = store.countAll({ userId: req.userId, category });
  res.set('X-Total-Count', String(totalCount));
  res.set('X-Total-Pages', String(Math.ceil(totalCount / limit)));

  res.json(results);
});

router.get('/summary', (req, res) => {
  res.json(buildSummary(store.getAll({ userId: req.userId })));
});

router.get('/summary/monthly', (req, res) => {
  res.json(buildMonthlySummary(store.getAll({ userId: req.userId }), budgetStore.getAllBudgets()));
});

function csvEscape(value) {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const all = store.getAll({ userId: req.userId });
  const normalized = q.toLowerCase();
  const matches = all.filter((e) => e.description.toLowerCase().includes(normalized));

  res.json(matches);
});

router.get('/export', (req, res) => {
  const all = store.getAll({ userId: req.userId });
  const header = 'id,amount,description,category,date';
  const rows = all.map((e) =>
    [e.id, e.amount, e.description, e.category, e.date].map(csvEscape).join(',')
  );
  const csv = [header, ...rows].join('\n');

  res.header('Content-Type', 'text/csv');
  res.attachment('expenses.csv');
  res.send(csv);
});

router.post('/import', (req, res) => {
  const { csv } = req.body;
  if (typeof csv !== 'string') {
    return res.status(400).json({ error: 'csv (string) is required' });
  }

  const lines = csv.trim().split('\n');
  const [, ...dataLines] = lines; // skip header row

  const imported = [];
  for (const line of dataLines) {
    const [, amount, description, category] = line.split(',');
    const expense = store.add({
      amount: Number(amount),
      description,
      category: category || 'uncategorized',
      date: new Date().toISOString(),
      userId: req.userId,
    });
    imported.push(expense);
  }

  res.status(201).json({ imported: imported.length, expenses: imported });
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
    userId: req.userId,
  });
  res.status(201).json(expense);
});

router.get('/:id', (req, res) => {
  const expense = store.getByIdForUser(Number(req.params.id), req.userId);
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

  const updated = store.update(Number(req.params.id), req.userId, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const deleted = store.remove(Number(req.params.id), req.userId);
  if (!deleted) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.status(204).send();
});

module.exports = router;
