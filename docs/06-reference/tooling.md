# Tooling

> _What this page covers:_ One-pager listing each tool used in the repo with a one-line summary and a link to the official docs.
> _Who it's for:_ Anyone who needs to look up which tool does what.

## Runtime and packaging

| Tool | Version | What it does | Docs |
|---|---|---|---|
| Node.js | `24.15.0` (exact) | JS runtime for both api and web build/dev | [nodejs.org](https://nodejs.org/) |
| pnpm | `10.33.2` (exact) | Package manager + workspace orchestrator | [pnpm.io](https://pnpm.io/) |
| TypeScript | per `tsconfig*.json` | Static typing across the whole repo | [typescriptlang.org](https://www.typescriptlang.org/) |

## Backend stack

| Tool | What it does | Docs |
|---|---|---|
| NestJS | Server framework: modules, DI, controllers, decorators | [docs.nestjs.com](https://docs.nestjs.com/) |
| Prisma | ORM + schema + migrations | [prisma.io/docs](https://www.prisma.io/docs) |
| PostgreSQL | Relational database | [postgresql.org/docs](https://www.postgresql.org/docs/) |
| class-validator | DTO runtime validation | [github.com/typestack/class-validator](https://github.com/typestack/class-validator) |
| @nestjs/swagger | OpenAPI generation from decorators | [docs.nestjs.com/openapi](https://docs.nestjs.com/openapi/introduction) |
| @nestjs/throttler | Rate limiting | [docs.nestjs.com/security/rate-limiting](https://docs.nestjs.com/security/rate-limiting) |
| bcrypt | Password hashing | [github.com/kelektiv/node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js) |

## Frontend stack

| Tool | What it does | Docs |
|---|---|---|
| Nuxt 4 | Vue meta-framework — routing, build, SPA mode | [nuxt.com/docs](https://nuxt.com/docs/getting-started/introduction) |
| Vue 3 | Component / reactivity framework | [vuejs.org](https://vuejs.org/) |
| Pinia | State management | [pinia.vuejs.org](https://pinia.vuejs.org/) |
| Vite | Build tool (bundled with Nuxt) | [vitejs.dev](https://vitejs.dev/) |

## Local infrastructure

| Tool | What it does | Docs |
|---|---|---|
| Docker | Container runtime for local dev | [docs.docker.com](https://docs.docker.com/) |
| Docker Compose | Orchestrates local services | [docs.docker.com/compose](https://docs.docker.com/compose/) |
| Traefik v3 | Reverse proxy + TLS termination on `*.traefik.me` | [doc.traefik.io](https://doc.traefik.io/traefik/) |
| traefik.me | Wildcard DNS service used in local dev | [github.com/pyrou/traefik.me](https://github.com/pyrou/traefik.me) |
| Adminer | Web UI for Postgres | [adminer.org](https://www.adminer.org/) |
| MailCatcher | Local SMTP catcher | [mailcatcher.me](https://mailcatcher.me/) |

## Tests

| Tool | What it does | Docs |
|---|---|---|
| Vitest | Unit-test runner everywhere except API e2e | [vitest.dev](https://vitest.dev/) |
| Jest | API e2e test runner | [jestjs.io](https://jestjs.io/) |
| supertest | HTTP assertions for Jest e2e | [github.com/ladjs/supertest](https://github.com/ladjs/supertest) |

## Code quality

| Tool | What it does | Docs |
|---|---|---|
| ESLint | Linter, flat config in `eslint.config.mjs` | [eslint.org](https://eslint.org/) |
| Prettier | Formatter, config in `.prettierrc.json` | [prettier.io](https://prettier.io/) |
| ts-prune | Reports unused exports | [github.com/nadeesha/ts-prune](https://github.com/nadeesha/ts-prune) |
| pre-commit | Runs configured hooks before each commit | [pre-commit.com](https://pre-commit.com/) |
| conventional-pre-commit | Enforces Conventional Commits | [github.com/compilerla/conventional-pre-commit](https://github.com/compilerla/conventional-pre-commit) |
| detect-secrets | Blocks committing secrets | [github.com/Yelp/detect-secrets](https://github.com/Yelp/detect-secrets) |

## Release and CI

| Tool | What it does | Docs |
|---|---|---|
| commit-and-tag-version | Bumps versions, generates CHANGELOG, tags | [github.com/absolute-version/commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) |
| GitLab CI | Pipeline runner | [docs.gitlab.com/ee/ci](https://docs.gitlab.com/ee/ci/) |
| Renovate | Automated dependency updates (config in `renovate.json`) | [docs.renovatebot.com](https://docs.renovatebot.com/) |

## See also

- [`docs/04-conventions/code-style.md`](../04-conventions/code-style.md)
- [`docs/04-conventions/testing.md`](../04-conventions/testing.md)
- [`docs/05-operations/release-process.md`](../05-operations/release-process.md)

---

_Last reviewed: 2026-05_
