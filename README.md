# Expense Tracker API

A simple REST API for tracking daily expenses, built with Node.js and Express.

## Features

- CRUD endpoints for expenses
- Filter by category, sort by date (asc/desc)
- Pagination
- Spending summary (total + by category)
- Monthly spending summary
- API key authentication
- Request logging (morgan)
- Persistent storage (JSON file)
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
`/health` does not require authentication.

## API Reference

### Health check

### List expenses

### Spending summary
Returns total amount, count, and a breakdown by category.

### Monthly summary
Returns totals grouped by `YYYY-MM`.

### Get one expense
### Create an expense
### Update an expense
### Delete an expense
## Project structure
## Roadmap

- [x] Spending summary & monthly breakdown
- [x] API key authentication
- [ ] User accounts (multi-user support)
- [ ] Swap JSON file storage for a real database
- [ ] Export expenses to CSV