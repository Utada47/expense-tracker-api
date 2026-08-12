# Expense Tracker API

A simple REST API for tracking daily expenses, built with Node.js and Express.

## Features

- CRUD endpoints for expenses
- Filter by category, sort by date (asc/desc)
- Pagination
- Spending summary (total + by category)
- Monthly spending summary
- API key authentication
- Rate limiting (100 requests / 15 min per IP)
- CSV export (with proper escaping)
- SQLite persistent storage
- Request logging (morgan)
- Persistent storage: SQLite (better-sqlite3)
- Test suite with Jest + Supertest

## Getting Started

### Requirements

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Configure

Copy `.env.example` to `.env` and set your own API key:

```bash
cp .env.example .env
```

```
PORT=3000
API_KEY=your-secret-key
```

### Run the server

```bash
npm start        # normal start
npm run dev       # auto-restart on file changes (nodemon)
```

Server runs at `http://localhost:3000` by default.

### Run tests

```bash
npm test
```

## Authentication

All `/expenses` routes require an API key header:

```
x-api-key: your-secret-key
```

`/health` does not require authentication.

## API Reference

### Health check

```
GET /health
```

### List expenses

```
GET /expenses?category=Food&page=1&limit=10&order=asc
```

### Spending summary

```
GET /expenses/summary
```

Returns total amount, count, and a breakdown by category.

### Monthly summary

```
GET /expenses/summary/monthly
```

Returns totals grouped by `YYYY-MM`.

### Export to CSV

```
GET /expenses/export
```

Downloads all expenses as a `.csv` file.

### Get one expense

```
GET /expenses/:id
```

### Create an expense

```
POST /expenses
Content-Type: application/json
x-api-key: your-secret-key

{
  "amount": 25,
  "description": "Coffee",
  "category": "Food"
}
```

### Update an expense

```
PUT /expenses/:id
```

### Delete an expense

```
DELETE /expenses/:id
```

## Project structure

```
src/
  index.js                # app entrypoint
  db.js                    # SQLite connection & schema
  store.js                 # data layer (SQLite queries)
  routes/expenses.js      # expense endpoints
  services/summary.js     # summary/monthly summary logic
  validators/expense.js   # input validation
  middleware/errorHandler.js
  middleware/auth.js      # API key check
tests/                    # Jest test suites
data/                     # SQLite database file (gitignored)
```

## Roadmap

- [x] Spending summary & monthly breakdown
- [x] API key authentication
- [x] Rate limiting
- [x] Export expenses to CSV
- [x] Swap JSON file storage for a real database (SQLite)
- [ ] User accounts (multi-user support)
