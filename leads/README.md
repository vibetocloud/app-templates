# __APP_NAME__

A contact form and the inbox for what it collects. Next.js (App Router) +
TypeScript + Prisma + Postgres.

- Anyone can send an enquiry; new ones can be marked as dealt with, or reopened.
- A honeypot field and a mostly-links check drop the obvious bot submissions.
- `GET /api/health` — 200 only after a successful database round-trip.

Migrations run automatically on deploy (`prisma migrate deploy`).

## Demo data

The first migration seeds three example enquiries so the inbox is not empty on
first open. They are tagged `example` and "Remove the example enquiries" deletes them.

## The inbox is public

The form and the inbox are the same page, so anyone with the link can read the
messages. Add a password before using it for real — ask Claude Code for one.

## Local

```
npm install && npm run dev
```

## Tests

```
npm test
```
