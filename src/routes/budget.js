const express = require('express');
const budgetStore = require('../budgetStore');

const router = express.Router();

router.post('/', (req, res) => {
  const { month, amount } = req.body;
  const budget = budgetStore.setBudget(month, amount);
  res.status(201).json(budget);
});

router.get('/:month', (req, res) => {
  const budget = budgetStore.getBudget(req.params.month);
  if (!budget) {
    return res.status(404).json({ error: 'No budget set for this month' });
  }
  res.json(budget);
});

module.exports = router;
