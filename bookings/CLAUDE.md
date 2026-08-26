# Working on this app

A room booking calendar. Next.js App Router, TypeScript, Prisma, Postgres.

## Where things go

| Put it here | For |
|---|---|
| `src/lib/bookings.ts` | Every database query. Nothing else imports Prisma. |
| `src/lib/overlap.ts` | Booking rules — can this booking exist? Pure functions. |
| `src/lib/week.ts` | Dates, the calendar window, layout maths. Pure functions. |
| `src/lib/types.ts` | Types shared between files. Component props stay with the component. |
| `src/app/actions.ts` | Server actions: read the form, validate, call `lib/`, revalidate. |
| `src/app/` | Routing only — `page.tsx`, `layout.tsx`, `api/`, `globals.css`. |
| `src/components/` | Components. No database calls, no business rules. |
| `test/*.test.ts` | Tests for anything in `src/lib` with a decision in it. |

Adding a feature usually means touching `lib/bookings.ts` (data), maybe
`lib/overlap.ts` (a rule), then the page or component. If a change puts a
Prisma call or a business rule inside a component or a server action, it is in
the wrong file.

Import components by their own path (`../components/calendar`). Do not add
`index.ts` barrel files: re-exporting a `'use client'` component through a
barrel widens the client bundle beyond what you asked for, and it makes builds
slower for no gain at this size.

## Rules worth keeping

- **Server actions are public endpoints.** Every export in a `'use server'`
  file can be called by anyone with any payload. Validate there, always.
- **Times are UTC everywhere**, so a booking shows the same wall-clock time to
  everyone. `fromInputValue` / `toInputValue` convert to and from form fields.
  There is a round-trip test; keep it passing.
- **Back-to-back bookings are allowed.** 09:00–10:00 and 10:00–11:00 do not
  clash. This is deliberate and tested.
- **Demo data** is seeded by the first migration and flagged `isDemo`. Editing
  one clears the flag so it survives "Remove the example bookings".
- **`/` must stay `force-dynamic`.** No database exists during `docker build`,
  so prerendering it breaks the deploy.

## Tests

```
npm test
```

`node --test`, no framework, no dependencies. Node 22 runs the TypeScript
directly, which is why imports of local files carry a `.ts` extension. Test the
logic in `src/lib`; do not add a test framework or a browser test runner unless
there is a real reason.

## Deploying

Push to the platform remote and deploy — migrations run automatically
(`prisma migrate deploy`). `GET /api/health` returns 200 only after a
successful database round-trip.

## There is no login

Anyone with the URL can create, edit and delete any booking. That is fine for a
private link on an internal board; do not put anything sensitive in it without
adding real access control first.
