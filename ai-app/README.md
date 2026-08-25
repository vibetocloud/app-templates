# __APP_NAME__

Claude-powered chat API — Fastify + `@anthropic-ai/sdk`. No database.

- `POST /chat` `{ "message": "..." }` → calls Claude (`claude-opus-4-8`) and returns the reply.
- `GET /health` → liveness + whether the API key is present.

## Environment

- `ANTHROPIC_API_KEY` — **required**. Store it with `app_create_config` using `kind: "secret"`; never commit it.

## Local

```
npm install && ANTHROPIC_API_KEY=sk-... npm run dev
```
