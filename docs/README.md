# Overbookd documentation

This folder holds the long-form documentation for the Overbookd codebase. The folder-level `README.md` files in `apps/`, `domains/`, `libraries/`, `constants/`, `utils/`, and `docker/` give a quick "what lives here" answer; this `docs/` tree is where the deeper "how it works and why" lives.

> **New to the repo?** Start with [`start-here/`](./start-here/README.md).

## Where to find what

| If you want to… | Go to |
|---|---|
| Get a fresh checkout running locally | [start-here/](./start-here/README.md) |
| Understand the layered monorepo | [architecture/dependency-hierarchy.md](./architecture/dependency-hierarchy.md) |
| Understand a business domain (FA, FT, charisma, signa, …) | [business/](./business/README.md) |
| Look up a festival-specific term | [business/glossary.md](./business/glossary.md) |
| Add an API endpoint, web page, or domain | [conventions/](./conventions/README.md) |
| See what `pnpm <something>` does | [reference/scripts.md](./reference/scripts.md) |
| Diagnose a broken local dev environment | [start-here/05-troubleshooting.md](./start-here/05-troubleshooting.md) → [operations/local-dev-gotchas.md](./operations/local-dev-gotchas.md) |
| Understand prod / preprod topology | [operations/deployment-topology.md](./operations/deployment-topology.md) |
| Cut a release | [operations/release-process.md](./operations/release-process.md) |

## Sections

- [`start-here/`](./start-here/README.md) — newcomer journey: prereqs → setup → repo tour → first feature → troubleshooting
- [`architecture/`](./architecture/README.md) — code structure, layering, request lifecycle, data model
- [`business/`](./business/README.md) — festival concepts, glossary, per-domain explanations
- [`conventions/`](./conventions/README.md) — commits, testing, code style, recipes for adding new things
- [`operations/`](./operations/README.md) — local-dev gotchas, deployment topology, database, releases
- [`reference/`](./reference/README.md) — scripts, environment variables, tooling

## Maintenance contract

Documentation only stays useful if it's updated alongside the code. Two simple rules:

1. **Update `/docs` in the same MR as the code change.** Reviewers will look for it.
2. **When in doubt, mark a section with `<!-- STALE: <reason> -->`** rather than letting it silently rot. Better to flag than to mislead.

Concretely:

| When you change… | Also check… |
|---|---|
| A domain in `domains/<name>/` | `docs/business/domains/<name>.md`, `docs/architecture/domain-driven-layout.md` |
| A NestJS module / controller / DTO in `apps/api/src/` | `docs/architecture/api-anatomy.md`, possibly `docs/business/domains/<name>.md` |
| A page or route in `apps/web/` | `docs/architecture/web-anatomy.md` |
| A `pnpm` script in any `package.json` | `docs/reference/scripts.md` |
| An env var read by the API or web | `docs/reference/environment-variables.md` |
| The Prisma schema | `docs/architecture/data-model.md` |
| Local dev orchestration (`docker/`) | `docs/start-here/02-local-setup.md`, `docs/operations/local-dev-gotchas.md` |
| The release flow or `.gitlab-ci.yml` | `docs/operations/release-process.md` |

The MR template includes a "Updated /docs if relevant (or N/A)" checkbox to keep this visible.

Each doc page ends with a `Last reviewed: YYYY-MM` line so newcomers can spot stale pages at a glance.

## Conventions used in this folder

- **Language:** English. (Folder-level READMEs in the rest of the repo remain in French — they predate this folder. They link here for the long-form content.)
- **Diagrams:** Mermaid, rendered natively by GitLab. No PNGs.
- **Cross-links:** repo-relative paths (`../architecture/...`) so they work both on GitLab and in local previews.
- **Page length:** 1–3 pages. Anything longer gets split.
- **Drafts:** content awaiting validation is wrapped in `<!-- DRAFT — needs validation -->` comments.

## Future improvements (not done in the initial pass)

- Translate the folder-level READMEs (`apps/README.md`, `domains/README.md`, etc.) to English.
- Add a CI lint job that checks for broken internal links and flags pages whose `Last reviewed` date is older than 12 months.
- Publish this folder to GitLab Pages for in-browser navigation with full-text search.

---

_Last reviewed: 2026-05_
