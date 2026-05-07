# Environment variables

> _What this page covers:_ Every env var the API and web read, what it's for, default value, and where it's set.
> _Who it's for:_ Anyone configuring a fresh environment.

In local dev, all env vars are sourced from `docker/.env` (committed to the repo with throwaway values). In prod, they live in the [`infra` repo](https://gitlab.com/24-heures-insa/infra) and are injected by the deployment.

## Local dev defaults (from `docker/.env`)

| Variable | Default | Used by | Purpose |
|---|---|---|---|
| `DOMAIN` | `traefik.me` | docker-compose | Wildcard DNS suffix used by Traefik routing |
| `OVERBOOKD_DOMAIN` | `overbookd.traefik.me` | docker-compose, web, api | Public hostname of the deployment |
| `BASE_URL` | `https://overbookd.traefik.me/api` | api | Used in absolute URLs (e.g. password-reset emails) |
| `OVERBOOKD_DATABASE_USERNAME` | `overbookd` | api | Postgres user |
| `OVERBOOKD_DATABASE_PASSWORD` | `password` | api | Postgres password (local only) |
| `OVERBOOKD_DATABASE_NAME` | `overbookd-local` | api | Postgres database name |
| `OVERBOOKD_JWT_SECRET` | `supersecret` | api | Secret used to sign JWTs (rotate in prod) |
| `OVERBOOKD_EMAIL_USER` | `overbookd@traefik.me` | api | "From" address used by transactional email |
| `OVERBOOKD_EMAIL_PASSWORD` | `password` | api | SMTP password (local only — mailcatcher accepts anything) |
| `OVERBOOKD_SWAGGER_USER` | `user` | api | Basic auth user for the Swagger UI |
| `OVERBOOKD_SWAGGER_PASSWORD` | `password` | api | Basic auth password for the Swagger UI |

⚠️ The local defaults are weak (`password`, `supersecret`) and are intentional — they make it impossible to accidentally point production at a dev container. **Never reuse them anywhere outside this dev compose.**

## Where each comes from

In Docker Compose, env vars are resolved from `docker/.env` (the file referenced by `--env-file`). They are then either:

- Forwarded into containers via `environment:` blocks in `docker/docker-compose.yml`.
- Used by Traefik labels for routing (e.g. `Host(\`mail.${DOMAIN}\`)`).

In production:
- The `.env` file (or equivalent) lives in the `infra` repo (or its secret store).
- Same variable names; production-grade values.
- The `OVERBOOKD_DATABASE_*`, `OVERBOOKD_JWT_SECRET`, and `OVERBOOKD_EMAIL_*` values are secrets and rotated periodically.

## Adding a new env var

1. Add it to `docker/.env` with a safe default and document it in this table.
2. Reference it in `docker/docker-compose.yml` for the relevant service.
3. Read it in code via the configuration helper in `utils/configuration` (don't read `process.env` directly).
4. Add a corresponding entry in the production env source (file an issue/MR on the `infra` repo).
5. Tick the "Updated /docs if relevant" checkbox in your MR — this page should always reflect what the apps read.

## Frontend env vars

The Nuxt SPA is statically built — it does not read env vars at runtime in production (the bundle is precompiled). Configuration that has to vary between environments comes through the API (`/api/configuration` endpoints — see `apps/api/src/configuration/`).

For build-time values (e.g. Sentry DSN, if added later), use Nuxt's runtime config in `nuxt.config.ts`.

## See also

- [`docker/.env`](../../docker/.env) — local dev defaults
- [`docker/docker-compose.yml`](../../docker/docker-compose.yml) — how vars are forwarded
- [`docs/operations/deployment-topology.md`](../operations/deployment-topology.md)

---

_Last reviewed: 2026-05_
