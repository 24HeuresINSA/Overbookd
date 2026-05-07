# Database

> _What this page covers:_ Local Prisma flow (migrate / reset / seed), production backups, and how to restore.
> _Who it's for:_ Anyone running a migration locally, or anyone who needs to find a backup.

For the deeper "schema → domain mapping" view, see [`docs/02-architecture/data-model.md`](../02-architecture/data-model.md).

## Local

The local database is a `postgresql` container in `docker/docker-compose.yml`. Data persists at `docker/data/postgresql/`.

| Action | Command |
|---|---|
| Apply pending migrations + regenerate the Prisma client | `pnpm db:migrate` |
| Generate the Prisma client only | `pnpm db:generate` |
| Re-run the seeder against the existing DB | `pnpm db:seed` |
| Drop, recreate, re-seed (destructive) | `pnpm db:reset` |
| Run any prisma command inside the api container | `pnpm db:exec '<cmd>'` |

Default credentials (baked into `docker/.env`):

| Field | Value |
|---|---|
| Host | `overbookd_postgresql` (from inside Docker) |
| Database | `overbookd-local` |
| User | `overbookd` |
| Password | `password` |

These are local-only — don't reuse them anywhere. Adminer at [`/adminer/`](https://overbookd.traefik.me/adminer/) is the easiest way to poke around.

## Adding a migration

1. Edit `apps/api/prisma/schema.prisma`.
2. Generate the migration:

   ```bash
   pnpm db:exec 'prisma migrate dev --name <descriptive-snake_case-name>'
   ```

3. Review the generated `apps/api/prisma/migrations/<timestamp>_<name>/migration.sql`.
4. **Commit the migration folder.** The migration history is part of the source.

⚠️ **Never edit a migration that has already been merged to `main`.** It has likely been applied to prod. To fix, write a new migration on top.

## Production

Configs and operations for prod / preprod live in the [`infra` repo](https://gitlab.com/24-heures-insa/infra). What follows is the orientation, not the runbook.

### Backups

A scheduled `backups.sh` produces archives:

```text
overbookd_<YYYY-MM-DD_HH-MM-SS>.tar.gz
```

- **Retention:** 14 days. Older archives are pruned automatically.
- **Storage:** local disk + optional `rsync` to a NAS (configurable at the bottom of the script).
- **What's backed up:** the Postgres `pg_dump` and the `images/` folder (volunteer profile pictures).

### Restoring

The exact restore procedure lives in the `infra` repo. The high-level shape is:

1. Identify the archive on the backups host.
2. Extract to a temp directory.
3. Restore the SQL dump into the target environment's Postgres (typically into a fresh DB, then swap).
4. Restore the `images/` folder onto the api container's volume.
5. Verify by hitting the API.

⚠️ **Do not restore over a live prod DB without coordination.** The restore is destructive.

## Seeders

`apps/api/prisma/seeders/` holds per-area seed data used by `pnpm db:seed`. Add or extend seeders when you add a feature that needs a non-empty starting state to be testable locally.

## See also

- [`docs/02-architecture/data-model.md`](../02-architecture/data-model.md) — schema overview and domain mapping
- [`docs/05-operations/deployment-topology.md`](./deployment-topology.md)
- [`24-heures-insa/infra`](https://gitlab.com/24-heures-insa/infra) — production runbooks

---

_Last reviewed: 2026-05_
