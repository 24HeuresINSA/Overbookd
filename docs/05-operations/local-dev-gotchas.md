# Local dev gotchas

> _What this page covers:_ Symptom → root cause → fix for the dev-environment pitfalls people actually hit on this repo.
> _Who it's for:_ Anyone whose local dev is broken in a way that isn't covered in [`docs/01-start-here/05-troubleshooting.md`](../01-start-here/05-troubleshooting.md).

This page collects the deeper / less obvious traps. The "first-week" basics are in the start-here troubleshooting page.

## Cross-platform native deps

The repo's `pnpm.onlyBuiltDependencies` includes `bcrypt`, `esbuild`, `@parcel/watcher`, `@prisma/client`, `prisma`, and `unrs-resolver`.

These build native binaries scoped to the OS / arch they're installed on. The host (e.g. macOS arm64) and the dev container (linux-musl arm64 inside Docker) **cannot share a `node_modules` tree**.

| Don't do this | Why |
|---|---|
| Run `pnpm install` once on the host, then mount and run inside the container | Container can't load the host's binaries |
| Copy `node_modules` between machines | Different OS / arch — instant breakage |
| Run `pnpm install` _inside_ the dev container while the host has its own `node_modules` | Pollutes the bind mount with binaries the host can't use |

The repo's `dev:init` runs `pnpm install` on the host. The dev container has its own per-package `node_modules` materialized inside the image at build time. Don't try to be clever.

## `pnpm.onlyBuiltDependencies`

Build scripts are off by default in pnpm 10. The packages listed under `pnpm.onlyBuiltDependencies` in the root `package.json` are explicitly allowed to run their post-install scripts.

If you add a dependency that needs native compilation (e.g. another binding that uses `node-gyp`), you'll see a warning that scripts were skipped. Add it to `pnpm.onlyBuiltDependencies` if you trust it.

## macOS Docker bind-mount permissions

When the repo lives under `~/Documents`, OrbStack / Docker Desktop need explicit **Files and Folders** permission on macOS. Without it, `docker exec overbookd_api ls /overbookd` is empty even though the bind mount looks correct in the compose file.

**Fix:** System Settings → Privacy & Security → Files and Folders → grant access to OrbStack/Docker for **Documents**. Restart Docker, then `pnpm dev:restart`.

## Prisma client mismatch after pulling main

Symptom: api container crashes with `PrismaClientInitializationError` or "schema does not match the database".

Cause: someone merged a migration; your local DB and/or generated client are stale.

Fix:

```bash
pnpm db:migrate     # apply pending migrations
# or, for the nuclear option (destructive):
pnpm db:reset       # drop, recreate, re-seed
```

## `pnpm dev:start` returns immediately but the app is unreachable

Cause: a container crashed silently during startup (often `api` failing on a missing migration or env var).

Fix: `pnpm dev:logs` and look for the failing service. The Traefik container itself will be running even if api/web aren't.

## TLS warnings only in Firefox

Firefox uses its own certificate store, separate from the OS. Even if `*.traefik.me` is trusted system-wide, Firefox will still warn.

**Fix:** Import the rootCA into Firefox specifically — see [`docs/01-start-here/02-local-setup.md` → Firefox](../01-start-here/02-local-setup.md#firefox-any-os).

## `*.traefik.me` is sometimes down

The `traefik.me` wildcard DNS service ([github.com/pyrou/traefik.me](https://github.com/pyrou/traefik.me)) is a free third-party service. It is occasionally unavailable.

**Fix:** Add explicit hosts entries — see [`docs/01-start-here/02-local-setup.md` → If `*.traefik.me` does not resolve](../01-start-here/02-local-setup.md#verify-it-works).

## Adminer credentials

Adminer at `/adminer/` doesn't auto-fill. Use the magic-link query string:

```text
https://overbookd.traefik.me/adminer/?pgsql=overbookd_postgresql&username=overbookd&db=overbookd-local&ns=public
```

Password: `password`. These credentials are baked into `docker/.env` and are local-only; don't reuse them for anything serious.

## CI passes locally but fails in GitLab

Common causes:

| Difference | What to check |
|---|---|
| Local node_modules cache hides a missing dependency | `pnpm install --frozen-lockfile` mirrors CI |
| Local DB has more seed data than CI's fresh DB | Run `pnpm db:reset` and reproduce |
| `vitest` is in watch mode locally vs `vitest:ci` in CI | Run `pnpm --filter <pkg> run test:unit:ci` |
| `pnpm prune` (ts-prune) catches dead exports CI uses | Run `pnpm prune` locally |

## Port conflicts (80 / 443)

Traefik binds 80 and 443. If something else (Nginx, another Docker stack) is using them, `pnpm dev:start` will fail.

**Fix:** Stop the other process or change the port mapping in `docker/docker-compose.yml`. Note that changing ports breaks the `*.traefik.me` URL convention.

## See also

- [`docs/01-start-here/05-troubleshooting.md`](../01-start-here/05-troubleshooting.md) — first-week errors
- [`docker/README.md`](../../docker/README.md) — French companion doc with extra detail

---

_Last reviewed: 2026-05_
