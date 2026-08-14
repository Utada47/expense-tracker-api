require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const expensesRouter = require('./routes/expenses');
const budgetRouter = require('./routes/budget');
const authRouter = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const requireApiKey = require('./middleware/auth');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(limiter);

app.get('/health', (req, res) => {
  let dbStatus = 'ok';
  try {
    db.prepare('SELECT 1').get();
  } catch (err) {
    dbStatus = 'error';
  }
  res.json({ status: 'ok', database: dbStatus });
});

app.use('/auth', authRouter);

app.use(requireApiKey);

app.use('/expenses', expensesRouter);
app.use('/budget', budgetRouter);

app.use(errorHandler);

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  function shutdown(signal) {
    console.log(`${signal} received, shutting down gracefully...`);
    server.close(() => {
      db.close();
      console.log('Server closed.');
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = app;
