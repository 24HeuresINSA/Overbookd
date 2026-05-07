# Overbookd API

NestJS backend for Overbookd. Exposes domain logic over HTTP and persists data via Prisma + PostgreSQL.

> **English deep-dive:** [`docs/architecture/api-anatomy.md`](../../docs/architecture/api-anatomy.md) · [`docs/architecture/data-model.md`](../../docs/architecture/data-model.md)

## Common commands

Run from the repo root:

```bash
pnpm db:exec 'prisma migrate dev'   # apply schema changes locally
pnpm db:seed                         # generate Prisma client + seed local DB
pnpm --filter @overbookd/api run test:e2e
```

Swagger UI is served at [https://overbookd.traefik.me/api/swagger](https://overbookd.traefik.me/api/swagger) when the dev stack is running.

## See also

- [`docs/start-here/02-local-setup.md`](../../docs/start-here/02-local-setup.md) — booting the API locally
- [`docs/conventions/adding-an-api-endpoint.md`](../../docs/conventions/adding-an-api-endpoint.md) — recipe for new endpoints
- [`docs/conventions/testing.md`](../../docs/conventions/testing.md) — UT vs e2e test conventions
- [NestJS documentation](https://docs.nestjs.com/) — upstream framework docs
