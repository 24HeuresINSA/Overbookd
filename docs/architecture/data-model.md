# Data model

> _What this page covers:_ Where the Prisma schema lives, how the client is generated, and how the schema maps to domains.
> _Who it's for:_ Anyone running a migration or wondering "where is this stored".

## Where things live

```text
apps/api/prisma/
├── schema.prisma         # Single-file Prisma schema (~50 models)
├── migrations/           # ~166 timestamped migrations, ordered
├── seed.ts               # Local seed entry point
└── seeders/              # Per-area seed data
```

The Prisma client is generated into `apps/api/src/generated/prisma`. The output path is set in the `generator client` block in `schema.prisma`. The generated folder is gitignored — every build runs `prisma generate`.

## Migration workflow

| Action | Command |
|---|---|
| Apply pending migrations + regenerate client | `pnpm db:migrate` |
| Generate the client without applying migrations | `pnpm db:generate` |
| Reset the local DB and re-seed (destructive) | `pnpm db:reset` |
| Re-run the seeder against the existing DB | `pnpm db:seed` |
| Run any other prisma command inside the api container | `pnpm db:exec '<cmd>'` |

All of these run **inside the api container** (so the host doesn't need a Postgres client or `prisma` CLI installed).

### Adding a migration

```bash
# Edit apps/api/prisma/schema.prisma to add/change a model
pnpm db:exec 'prisma migrate dev --name <descriptive-snake_case-name>'
```

Prisma generates a migration folder named `<timestamp>_<name>/` containing `migration.sql`. **Commit it** — the migration history is part of the source.

⚠️ **Never edit a migration that has already been merged to `main`.** It has likely been applied to prod. If you need to fix it, write a new migration on top.

## Schema → domain mapping

50 models, 10 domains. Roughly:

| Prisma models | Domain |
|---|---|
| `User`, `Preference`, `Friend`, `Notification` | `personal-account` (and shared) |
| `Team`, `UserTeam`, `MembershipApplication`, `Permission`, `TeamPermission` | `access-manager` |
| `Transaction`, `Contribution`, `Barrel` | `personal-account`, `contribution` |
| `CharismaPeriod`, `CharismaEventParticipation` | `charisma` |
| `SignaLocation`, `CatalogSignage`, `FestivalActivitySignage` | `signa` |
| `CatalogCategory`, `CatalogGear`, `InventoryRecord`, `Borrow`, `BorrowGearRequest`, `Purchase`, `PurchaseGearRequest` | `logistic` |
| `FestivalActivity`, `FestivalActivityTimeWindow*`, `FestivalActivityElectricitySupply`, `FestivalActivityInquiryRequest`, `FestivalActivityReview`, `FestivalActivityHistory`, `FestivalActivityFeedback`, `Contractor`, `FestivalTask`, `FestivalTask*` | `festival-event` |
| `Assignment`, `Assignee`, `FestivalTaskMobilization*` | `assignment` |
| `VolunteerAvailability`, `BreakPeriod` | `volunteer-availability` |
| `Configuration` | shared (`utils/configuration`) |
| `SharedMeal`, `Shotgun` | shared (per-feature) |

The mapping is approximate — some models are referenced by multiple domains.

## Repository layer

Domains define **ports** (interfaces) that describe what they need from persistence. Adapters in `apps/api/src/<slice>/repository/` implement those ports using Prisma.

The domain side never imports `@prisma/client`. This is what allows domain UTs to use fakes and skip the database entirely.

For more on this pattern, see [`docs/architecture/api-anatomy.md`](./api-anatomy.md#the-repository-adapter).

## Backups and prod data

Local data is throwaway — `pnpm db:reset` whenever it's wrong.

Prod is backed up daily by a cron-driven `backups.sh` script (`overbookd_AAAA-MM-DD_HH-MM-SS.tar.gz`, 14-day retention, optional rsync to a NAS). The script and topology live in the [`infra` repo](https://gitlab.com/24-heures-insa/infra). For the operator's view see [`docs/operations/database.md`](../operations/database.md).

## See also

- [`docs/architecture/api-anatomy.md`](./api-anatomy.md)
- [`docs/operations/database.md`](../operations/database.md)
- [Prisma documentation](https://www.prisma.io/docs)

---

_Last reviewed: 2026-05_
