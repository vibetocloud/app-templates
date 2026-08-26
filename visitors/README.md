# __APP_NAME__

A visitor sign-in board. Next.js (App Router) + TypeScript + Prisma + Postgres.

- Visitors sign themselves in; reception can sign them out.
- Shows who is in the building right now, with how long they have been in — useful
  for a fire roll call.
- `GET /api/health` — 200 only after a successful database round-trip.

Migrations run automatically on deploy (`prisma migrate deploy`).

## Demo data

The first migration seeds three example visitors so the screen is not empty on
first open. They are tagged `example` and "Remove the example visitors" deletes them.

## Local

```
npm install && npm run dev
```

## Tests

```
npm test
```
