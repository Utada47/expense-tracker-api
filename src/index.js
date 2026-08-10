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
  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.json(expense);
});

app.put('/expenses/:id', (req, res) => {
  const updated = store.update(Number(req.params.id), req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.json(updated);
});

app.delete('/expenses/:id', (req, res) => {
  const deleted = store.remove(Number(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
