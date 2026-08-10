const express = require('express');
const store = require('../store');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(store.getAll());
});

router.post('/', (req, res) => {
  const { amount, description, category } = req.body;

  if (typeof amount !== 'number' || !description) {
    return res.status(400).json({ error: 'amount (number) and description are required' });
  }

  const expense = store.add({ amount, description, category: category || 'uncategorized' });
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
