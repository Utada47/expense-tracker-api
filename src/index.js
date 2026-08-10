const express = require('express');
const store = require('./store');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/expenses', (req, res) => {
  res.json(store.getAll());
});

app.post('/expenses', (req, res) => {
  const { amount, description } = req.body;

  if (typeof amount !== 'number' || !description) {
    return res.status(400).json({ error: 'amount (number) and description are required' });
  }

  const expense = store.add({ amount, description });
  res.status(201).json(expense);
});

app.get('/expenses/:id', (req, res) => {
  const expense = store.getById(Number(req.params.id));
  res.json(expense);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
