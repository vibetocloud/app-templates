# __APP_NAME__

Full-stack Next.js (App Router) + TypeScript + Prisma + Postgres.

- SSR pages + API routes in one service.
- `GET /api/health` — 200 only after a successful database round-trip.

Migrations run automatically on deploy (`prisma migrate deploy`).

## Environment

- `DATABASE_URL` — Postgres connection string (provided by the compose `db` service in local dev).

## Local

```
npm install && npm run dev
```
