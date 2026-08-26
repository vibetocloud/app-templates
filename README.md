<p align="center">
  <img src="./assets/logo.svg" width="120" height="120" alt="Vibe to Cloud logo">
</p>

<p align="center"><em>Vibe to Cloud — describe your app and we build, host, and deploy it for you.</em></p>

# Starter Templates

The official project templates for the [Vibe to Cloud](https://vibetocloud.io) platform.

When you create an application on the platform and pick a template, the files in
that template's directory are scaffolded into your new app's repository — with
`__APP_NAME__` / `__APP_SLUG__` placeholders filled in — and deployed. Everything
here is public so you can see exactly what you're getting before you pick one.

## Templates

| ID | Name | What it sets up |
|----|------|-----------------|
| `empty` | Empty | A minimal static starter — the Vibe to Cloud logo on a page, served by nginx. No build, no backend. |
| `bookings` | Room bookings | A room booking calendar with day and week views. Next.js + TypeScript + Prisma + Postgres; double-booking is prevented and demo data is seeded. |
| `visitors` | Visitor sign-in | A visitor sign-in board for reception. Next.js + TypeScript + Prisma + Postgres; shows who is in the building and for how long. |
| `leads` | Enquiry inbox | A contact form and the shared inbox for what it collects. Next.js + TypeScript + Prisma + Postgres. |
| `fastify-api` | API Service | REST API using Fastify + TypeScript + Prisma + Postgres. Health check gated on the database, migrations applied on deploy. |
| `ai-app` | AI App | Claude-powered chat API (Fastify + `@anthropic-ai/sdk`). Reads `ANTHROPIC_API_KEY` from a secret; no database. |
| `decoupled-fullstack` | Full-stack (decoupled) | Vite React SPA + a separate Fastify/Prisma API + Postgres, as three compose services. Exercises multi-container networking. |

## Layout

```
registry.json          # the catalog the platform reads
<template-id>/         # one directory per template — the files that get scaffolded
```

`registry.json` is an array of `{ id, name, description, tags }`, where `id`
matches a directory name. The platform reads this repo's `main` branch live, so a
merged change appears in the catalog and is scaffoldable without any redeploy.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) — how to add a template, the
`__APP_NAME__` / `__APP_SLUG__` placeholders, and guidelines.

## License

[MIT](./LICENSE).
