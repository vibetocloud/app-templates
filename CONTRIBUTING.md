# Contributing

Open a pull request against `main`. Only merged changes go live — a PR on its own
changes nothing. The platform reads this repo's `main` branch live, so once your
change is merged it appears in the template catalog and is scaffoldable without
any redeploy.

## Adding a template

1. Create a `<template-id>/` directory with the files to be scaffolded.
2. Add a matching entry to `registry.json` — the `id` **must** equal the
   directory name:
   ```json
   { "id": "<template-id>", "name": "Human name", "description": "What it sets up", "tags": ["..."] }
   ```

## Placeholders

Text files may use these tokens, substituted at scaffold time:

- `__APP_NAME__` — the human-readable application name the user chose
- `__APP_SLUG__` — a URL/package-safe slug derived from it

## Found a bug?

Open an [issue](https://github.com/vibetocloud/app-templates/issues) describing
which template, what you expected, and what happened. If you already have a fix,
a pull request is welcome instead.

## Guidelines

- Keep templates minimal and deployable as-is — they are someone's starting point.
- A template that needs a database should gate its health check on that database.
- Don't commit secrets or real credentials; use placeholders and platform secrets.
