# app-templates

Starter templates for the [Vibe to Cloud](https://vibetocloud.com) platform.

When you create an application on the platform and pick a template, the files in
that template's directory are scaffolded into your new app's repository — with
`__APP_NAME__` / `__APP_SLUG__` placeholders filled in — and deployed. Everything
here is public so you can see exactly what you're getting before you pick one.

## Templates

| ID | Name | What it sets up |
|----|------|-----------------|
| `static-spa` | Static SPA | Vite + React + TypeScript single-page app served by nginx. No backend or database. |
| `fastify-api` | API Service | REST API using Fastify + TypeScript + Prisma + Postgres. Health check gated on the database, migrations applied on deploy. |
| `ai-app` | AI App | Claude-powered chat API (Fastify + `@anthropic-ai/sdk`). Reads `ANTHROPIC_API_KEY` from a secret; no database. |
| `next-fullstack` | Full-stack (Next.js) | Next.js App Router + TypeScript + Prisma + Postgres. SSR + API routes in one service; health route gated on the database. |
| `decoupled-fullstack` | Full-stack (decoupled) | Vite React SPA + a separate Fastify/Prisma API + Postgres, as three compose services. Exercises multi-container networking. |

## Layout

```
registry.json          # the catalog the platform reads
<template-id>/         # one directory per template — the files that get scaffolded
```

`registry.json` is an array of `{ id, name, description, tags }`, where `id`
matches a directory name. The platform reads this repo's `main` branch live, so a
merged change appears in the catalog and is scaffoldable without any redeploy.

### Placeholders

Text files may use these tokens, substituted at scaffold time:

- `__APP_NAME__` — the human-readable application name the user chose
- `__APP_SLUG__` — a URL/package-safe slug derived from it

## Contributing

Open a pull request against `main`. Only merged changes go live — a PR on its own
changes nothing. To add a template: create a `<template-id>/` directory and add a
matching entry to `registry.json` (the `id` must equal the directory name).

## License

[MIT](./LICENSE).
