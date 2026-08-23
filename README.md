# ephemeral-test-app

Sample Next.js 14 (App Router, TypeScript) + Prisma + PostgreSQL 16 app used to
validate [Ephemeral](https://github.com/jkerketta/ephemeral) PR preview
environments end to end.

- `Todo` model with add + toggle via Server Actions (`/` lists todos)
- `/api/health` returns `{ "status": "ok" }`
- `/api/todos` GET/POST JSON endpoints
- Multi-stage Dockerfile (node:20-slim, standalone output,
  `prisma migrate deploy` on container start)
- Compose stack: `web` (labelled `ephemeral.web=true`) + `db`
  (postgres:16-alpine, tmpfs — all data is throwaway; credentials are
  throwaway too)

## Run locally

```sh
docker compose up --build
# open http://localhost:3000
```

## Validate compose config

```sh
docker compose config -q
```
