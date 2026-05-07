# Overbookd

Management software for the [24 Heures de l'INSA](https://24heures.org/) festival, maintained by the [Club des 24 heures de l'INSA](https://gitlab.com/24-heures-insa). It is a pnpm monorepo with a NestJS API, a Nuxt 4 SPA, and a layered set of shared packages.

## Quick start

```bash
pnpm dev:init        # one-time: traefik network + dependencies + dev image
pnpm dev:start       # boot the stack
pnpm db:seed         # one-time: generate Prisma client + seed the local DB
```

Once the containers are up, the app is at [https://overbookd.traefik.me](https://overbookd.traefik.me) and the API at [https://overbookd.traefik.me/api](https://overbookd.traefik.me/api). If `*.traefik.me` does not resolve, see [`docs/01-start-here/02-local-setup.md`](./docs/01-start-here/02-local-setup.md).

> First time on the repo? **Read [`docs/01-start-here/`](./docs/01-start-here/README.md).** It walks you from a fresh checkout to your first merged MR.

## Documentation

Long-form documentation lives in [`docs/`](./docs/README.md):

- [`01-start-here/`](./docs/01-start-here/README.md) — newcomer journey
- [`02-architecture/`](./docs/02-architecture/README.md) — code structure, layering, request lifecycle
- [`03-business/`](./docs/03-business/README.md) — festival concepts and glossary
- [`04-conventions/`](./docs/04-conventions/README.md) — commits, testing, recipes
- [`05-operations/`](./docs/05-operations/README.md) — local-dev gotchas, deployment topology, releases
- [`06-reference/`](./docs/06-reference/README.md) — scripts, env vars, tooling

The folder-level `README.md` files (in `apps/`, `domains/`, `libraries/`, `constants/`, `utils/`, `docker/`) give the "what lives here" answer for that folder. They are kept short on purpose — deeper explanations live in `docs/`.

## Commits

This repo uses [Conventional Commits](https://www.conventionalcommits.org/). Allowed types and the release flow are documented in [`docs/04-conventions/commits-and-branches.md`](./docs/04-conventions/commits-and-branches.md).

## License

See [LICENSE](./LICENSE).
