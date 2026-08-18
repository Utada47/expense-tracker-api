# Changelog

All notable changes to this project are documented here.

## [1.0.0]

### Added
- Refresh tokens (`POST /auth/refresh`) alongside short-lived access tokens
- Self-service account deletion (`DELETE /auth/account`) with full cascade cleanup
- Security headers via `helmet`
- MIT license

## [0.8.0]
- Password reset flow (`forgot-password` / `reset-password`)
- Change password endpoint with current-password verification

## [0.7.0]
- Search endpoint (`GET /expenses/search`)
- CSV import (`POST /expenses/import`)
- Pagination metadata via `X-Total-Count` / `X-Total-Pages` headers

## [0.6.0]
- Multi-user authentication with JWT (register, login, `/auth/me`)
- All expense data scoped per authenticated user

## [0.5.0]
- Monthly budgets with over-budget detection in the monthly summary

## [0.4.0]
- Docker support (`Dockerfile`, `docker-compose.yml`)
- GitHub Actions CI pipeline
- Graceful shutdown and enhanced `/health` check

## [0.3.0]
- Migrated storage from a JSON file to SQLite (`better-sqlite3`)
- CSV export with proper comma/quote escaping

## [0.2.0]
- Spending summary and monthly summary endpoints
- API key authentication, rate limiting, CORS, request logging

## [0.1.0]
- Initial release: CRUD endpoints for expenses (Express + in-memory store)
