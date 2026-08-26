# Working on this app

An enquiry form and a shared inbox for the messages it collects.
Next.js App Router, TypeScript, Prisma, Postgres.

## Where things go

| Put it here | For |
|---|---|
| `src/lib/inbox.ts` | Every database query. Nothing else imports Prisma. |
| `src/lib/leads.ts` | The rules — validation, spam checks, time wording. Pure functions. |
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
- **The form is public, so it gets bots.** A honeypot field plus a
  mostly-links check catches the obvious ones. Spam is accepted and dropped
  rather than refused — a bot that knows it was caught just tries again.
- **Marking as dealt with is idempotent** — it only updates rows still open, so
  a second click cannot move the time.
- **Email is checked loosely on purpose.** The only real test of an address is
  sending to it; the check is there to catch typos, not to enforce a spec.
- **A long message is refused, never truncated.** Losing the end of what
  somebody wrote is worse than asking them to shorten it.
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

The inbox is on the same page as the form, so anyone with the URL can read the
enquiries people send you. That is fine while you are trying this out, but
enquiries contain other people's names and email addresses — put a password on
the page before you use it for real. "Put a password on the inbox" is the first
suggestion in Make it yours for exactly that reason.
