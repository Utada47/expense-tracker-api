require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const expensesRouter = require('./routes/expenses');
const errorHandler = require('./middleware/errorHandler');
const requireApiKey = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(requireApiKey);

app.use('/expenses', expensesRouter);

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
