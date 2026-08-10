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
  const expense = store.add(req.body);
  res.status(201).json(expense);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
