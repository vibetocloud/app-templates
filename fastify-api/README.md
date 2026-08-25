# __APP_NAME__

REST API — Fastify + TypeScript + Prisma + Postgres.

- `GET /health` — 200 only after a successful database round-trip.
- `GET /notes`, `POST /notes` — minimal CRUD example.

Migrations run automatically on deploy (`prisma migrate deploy`).

## Environment

- `DATABASE_URL` — Postgres connection string (provided by the compose `db` service in local dev).

## Local

```
npm install && npm run dev
```
