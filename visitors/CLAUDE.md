# Working on this app

A visitor sign-in board for a reception desk or a tablet by the door.
Next.js App Router, TypeScript, Prisma, Postgres.

## Where things go

| Put it here | For |
|---|---|
| `src/lib/visitors.ts` | Every database query. Nothing else imports Prisma. |
| `src/lib/visits.ts` | The rules — who is on site, duration wording, sign-in checks. Pure functions. |
| `src/app/actions.ts` | Server actions: read the form, validate, call `lib/`, revalidate. |
| `src/app/` | Routing only — `page.tsx`, `layout.tsx`, `api/`, `globals.css`. |
| `src/components/` | Components. No database calls, no business rules. |
| `test/*.test.ts` | Tests for anything in `src/lib` with a decision in it. |

If a change puts a Prisma call or a rule inside a component or a server action,
it is in the wrong file. Import components by their own path; do not add
`index.ts` barrel files — re-exporting a `'use client'` component through a
barrel widens the client bundle for no gain at this size.

## Rules worth keeping

- **Server actions are public endpoints.** Every export in a `'use server'`
  file can be called by anyone with any payload. Validate there, always.
- **Signing in twice is refused** while someone is still signed in. The board is
  only useful if it says who is actually in the building.
- **Signing out is idempotent** — `signOut` only updates rows still open, so a
  second click cannot move the time.
- **Names are compared case- and space-insensitively.** People type their name
  differently each visit.
- **Durations round down** so a visit never reads longer than it is.
- **`/` must stay `force-dynamic`.** No database exists during `docker build`,
  so prerendering it breaks the deploy.
- **Demo data** is seeded by the first migration and flagged `isDemo`.

## Tests

```
npm test
```

`node --test`, no framework, no dependencies. Node 22 runs the TypeScript
directly, which is why imports of local files carry a `.ts` extension.

## Deploying

Push to the platform remote and deploy — migrations run automatically
(`prisma migrate deploy`). `GET /api/health` returns 200 only after a
successful database round-trip.

## There is no login

Anyone with the URL can sign people in and out, and can see who is in the
building. That is usually acceptable for a kiosk on a private URL, but a
visitor list is personal data — do not put it on a public address without
adding access control first.
