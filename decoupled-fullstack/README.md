# __APP_NAME__

Decoupled full-stack app — three services:

- `frontend` — Vite + React SPA (nginx), talks to the API via `VITE_API_URL`.
- `api` — Fastify + Prisma API (see `api/README.md`).
- `db` — Postgres.

The API runs `prisma migrate deploy` on start. Locally the frontend calls the API on `http://localhost:3001`.

## Local

```
docker compose up --build
```
