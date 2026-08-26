# __APP_NAME__

A room booking calendar. Next.js (App Router) + TypeScript + Prisma + Postgres.

- Day and week calendar; click an empty slot to reserve, click a booking to edit or delete.
- A room cannot be double-booked. Back-to-back bookings are allowed on purpose:
  09:00–10:00 and 10:00–11:00 do not clash.
- `GET /api/health` — 200 only after a successful database round-trip.

Migrations run automatically on deploy (`prisma migrate deploy`).

## Demo data

The first migration seeds three rooms and three example bookings so the app has
something in it on first open. They are tagged `example` in the interface and
"Remove the example bookings" deletes them. Editing one turns it into a real
booking so it will not be swept away later.

## Times

Times are handled in UTC, so a booking shows the same wall-clock time to
everyone. That suits a single-site booking board; add a per-organisation
timezone if you need more.

## Anyone with the link can book

There is no login. On a private URL that is usually fine for an internal board,
but treat the page as public. Ask Claude Code for a password on the page if you
need a front door.

## Environment

- `DATABASE_URL` — Postgres connection string (provided by the compose `db` service in local dev).

## Local

```
npm install && npm run dev
```

## Tests

```
npm test
```

Covers the booking rules and the calendar layout maths — no framework, just `node --test`.
