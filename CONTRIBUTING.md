# Contributing

Thanks for considering a contribution to expense-tracker-api!

## Getting started

```bash
npm install
cp .env.example .env
npm test
```

Make sure all tests pass before opening a pull request.

## Development workflow

1. Create a branch for your change.
2. Write or update tests alongside any code change — this project follows a test-first approach where possible (see `CHANGELOG.md` for examples of bugs caught this way during development).
3. Run `npm test` and confirm everything passes.
4. Run `npm run dev` to manually verify the change against a running server if it affects behavior.
5. Update `README.md` if you added or changed an endpoint.
6. Open a pull request. GitHub Actions will automatically run the test suite.

## Code style

- Keep route handlers thin; put business logic in `services/`, data access in `store.js` / `*Store.js` files.
- Validate all user input before touching the database.
- Prefer parameterized SQL queries (already the pattern throughout `store.js`) — never string-concatenate user input into SQL.
- New routes that read or modify expense data must go through `requireAuth` and be scoped to `req.userId`.

## Reporting issues

Open a GitHub issue with steps to reproduce, expected behavior, and actual behavior.
