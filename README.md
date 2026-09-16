# ephemeral-test-app (ephemeral E2E test PR)

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
# web publishes no host port (previews are routed via Traefik in Ephemeral);
# smoke-test from inside the container:
docker compose exec web node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>r.text()).then(console.log)"
```

## Validate compose config

```sh
docker compose config -q
```

Rebuild trigger line: 17:27:19Z
Reopen trigger line: 17:46:21Z
