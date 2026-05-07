# Scripts

> _What this page covers:_ Annotated table of every `pnpm` script in the root `package.json` and the per-package scripts worth knowing.
> _Who it's for:_ Anyone wondering what a `pnpm` command does before running it.

Run all of these from the repo root unless noted. The full list of root scripts is in [`package.json`](../../package.json) — this page explains them.

## Local dev

| Script | What it does | When to run |
|---|---|---|
| `pnpm dev:init` | Creates the `traefik-public` Docker network, runs `pnpm install` on the host, builds the `overbookd:dev` image | Once on a fresh checkout |
| `pnpm dev:start` | Boots the full Docker stack detached (api, web, postgres, traefik, mail_catcher, adminer) | Every dev session |
| `pnpm dev:stop` | Stops the stack but keeps containers | At end of session if you want a fast restart |
| `pnpm dev:restart` | Restarts all containers | After config changes that aren't picked up by HMR |
| `pnpm dev:down` | Stops and removes containers | When you want a clean state |
| `pnpm dev:logs` | Tails logs from all containers | Debugging |
| `pnpm dev:bash` | Opens an interactive shell in a one-shot dev container with the repo mounted | Running ad-hoc node/npm/pnpm commands |
| `pnpm dev:build` | Rebuilds the `overbookd:dev` image and starts the stack | After Dockerfile changes |
| `pnpm dev:clean` | `dev:down` + recursively wipes `node_modules`, `.pnpm-store`, `dist`, `coverage`, `.nuxt`, `.output`, `generated` outside `docker/`, then `docker system prune --all` | Nuking the whole dev state — destructive |
| `pnpm dev:sync-version` | Restarts api/web containers if running | Used by `release:*` scripts; rarely run directly |

## Database

All run inside the api container.

| Script | What it does |
|---|---|
| `pnpm db:exec '<cmd>'` | Run any prisma command (e.g. `pnpm db:exec 'prisma generate'`) |
| `pnpm db:generate` | `prisma generate` — regenerate the Prisma client |
| `pnpm db:seed` | Generate client + run the seeders. Run on first checkout |
| `pnpm db:migrate` | `prisma migrate dev` — apply pending migrations |
| `pnpm db:reset` | `prisma migrate reset` + re-seed. **Destructive** |

## Quality

| Script | What it does |
|---|---|
| `pnpm lint` | `eslint --fix` recursively across every package |
| `pnpm format` | `prettier --write` recursively across every package |
| `pnpm prune` | `ts-prune` recursively — reports unused exports |
| `pnpm preinstall` | Blocks `npm` and `yarn`. Don't call directly |

## Tests

| Script | What it does |
|---|---|
| `pnpm --filter @overbookd/<pkg> run test:unit` | Vitest watch mode for one package |
| `pnpm --filter @overbookd/<pkg> run test:unit:ci` | Vitest CI mode (no watch) for one package |
| `pnpm --filter @overbookd/api run test:e2e` | Jest e2e suite for the API |
| `pnpm --recursive run test:unit:ci` | Vitest CI mode across every package |

Useful Vitest filters:

```bash
pnpm --filter @overbookd/festival-event run test:unit -- src/festival-activity/creation/creation.spec.ts
pnpm --filter @overbookd/festival-event run test:unit -- -t "draft creation"
```

## Release

The `release:*` family is documented in [`docs/05-operations/release-process.md`](../05-operations/release-process.md). Quick reference:

| Script | What it does |
|---|---|
| `pnpm release:patch` | Patch bump (with local container restart) |
| `pnpm release:minor` | Minor bump (with local container restart) |
| `pnpm release:major` | Major bump (with local container restart) |
| `pnpm release:patch:no-sync` | Patch bump without restarting local containers |
| `pnpm release:minor:no-sync` | Minor bump without restarting local containers |
| `pnpm release:major:no-sync` | Major bump without restarting local containers |
| `pnpm release:candidate` | Bump as `-rc` prerelease |
| `pnpm release` | Run `commit-and-tag-version` directly (low-level) |

Underlying helpers (rarely run directly):

| Script | What it does |
|---|---|
| `pnpm version:patch-dependency` | `version:patch` on packages that have new commits relative to `origin/main` |
| `pnpm version:minor-dependency` | Same with minor |
| `pnpm version:major-dependency` | Same with major |
| `pnpm version:bump-dependent` | Patch-bump packages that consume the just-bumped dependents |

## CI bootstrap

| Script | What it does |
|---|---|
| `pnpm ci:init` | Installs `pre-commit` via Python pip and registers the commit hooks. Run once per machine if you intend to commit |

## Per-package scripts

Each domain / library / app exposes:

- `lint`, `format`, `prune`
- `test:unit`, `test:unit:ci` (where logic lives)
- `version:patch`, `version:minor`, `version:major`
- For apps: `build`, `start`, `dev`, `test:e2e` (api only)

Look at any sibling package for the canonical shape.

## See also

- [`docs/05-operations/release-process.md`](../05-operations/release-process.md)
- [`docs/04-conventions/testing.md`](../04-conventions/testing.md)
- [`docs/01-start-here/02-local-setup.md`](../01-start-here/02-local-setup.md)

---

_Last reviewed: 2026-05_
