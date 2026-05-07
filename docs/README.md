# Overbookd documentation

This folder holds the long-form documentation for the Overbookd codebase. The folder-level `README.md` files in `apps/`, `domains/`, `libraries/`, `constants/`, `utils/`, and `docker/` give a quick "what lives here" answer; this `docs/` tree is where the deeper "how it works and why" lives.

> **New to the repo?** Start with [`01-start-here/`](./01-start-here/README.md).

## Where to find what

| If you want to… | Go to |
|---|---|
| Get a fresh checkout running locally | [01-start-here/](./01-start-here/README.md) |
| Understand the layered monorepo | [02-architecture/dependency-hierarchy.md](./02-architecture/dependency-hierarchy.md) |
| Understand a business domain (FA, FT, charisma, signa, …) | [03-business/](./03-business/README.md) |
| Look up a festival-specific term | [03-business/glossary.md](./03-business/glossary.md) |
| Add an API endpoint, web page, or domain | [04-conventions/](./04-conventions/README.md) |
| See what `pnpm <something>` does | [06-reference/scripts.md](./06-reference/scripts.md) |
| Diagnose a broken local dev environment | [01-start-here/05-troubleshooting.md](./01-start-here/05-troubleshooting.md) → [05-operations/local-dev-gotchas.md](./05-operations/local-dev-gotchas.md) |
| Understand prod / preprod topology | [05-operations/deployment-topology.md](./05-operations/deployment-topology.md) |
| Cut a release | [05-operations/release-process.md](./05-operations/release-process.md) |

## Sections

- [`01-start-here/`](./01-start-here/README.md) — newcomer journey: prereqs → setup → repo tour → first feature → troubleshooting
- [`02-architecture/`](./02-architecture/README.md) — code structure, layering, request lifecycle, data model
- [`03-business/`](./03-business/README.md) — festival concepts, glossary, per-domain explanations
- [`04-conventions/`](./04-conventions/README.md) — commits, testing, code style, recipes for adding new things
- [`05-operations/`](./05-operations/README.md) — local-dev gotchas, deployment topology, database, releases
- [`06-reference/`](./06-reference/README.md) — scripts, environment variables, tooling

## Maintenance contract

Documentation only stays useful if it's updated alongside the code. Two simple rules:

1. **Update `/docs` in the same MR as the code change.** Reviewers will look for it.
2. **When in doubt, mark a section with `<!-- STALE: <reason> -->`** rather than letting it silently rot. Better to flag than to mislead.

Concretely:

| When you change… | Also check… |
|---|---|
| A domain in `domains/<name>/` | `docs/03-business/domains/<name>.md`, `docs/02-architecture/domain-driven-layout.md` |
| A NestJS module / controller / DTO in `apps/api/src/` | `docs/02-architecture/api-anatomy.md`, possibly `docs/03-business/domains/<name>.md` |
| A page or route in `apps/web/` | `docs/02-architecture/web-anatomy.md` |
| A `pnpm` script in any `package.json` | `docs/06-reference/scripts.md` |
| An env var read by the API or web | `docs/06-reference/environment-variables.md` |
| The Prisma schema | `docs/02-architecture/data-model.md` |
| Local dev orchestration (`docker/`) | `docs/01-start-here/02-local-setup.md`, `docs/05-operations/local-dev-gotchas.md` |
| The release flow or `.gitlab-ci.yml` | `docs/05-operations/release-process.md` |

The MR template includes a "Updated /docs if relevant (or N/A)" checkbox to keep this visible.

Each doc page ends with a `Last reviewed: YYYY-MM` line so newcomers can spot stale pages at a glance.

## Conventions used in this folder

- **Language:** English. (Folder-level READMEs in the rest of the repo remain in French — they predate this folder. They link here for the long-form content.)
- **Diagrams:** Mermaid, rendered natively by GitLab. No PNGs. To read them inside VS Code or WebStorm you need a plugin — see [`01-start-here/01-prerequisites.md` → Mermaid plugin](./01-start-here/01-prerequisites.md#mermaid-plugin-required-to-read-these-docs).
- **Cross-links:** repo-relative paths (`../02-architecture/...`) so they work both on GitLab and in local previews.
- **Page length:** 1–3 pages. Anything longer gets split.
- **Drafts:** content awaiting validation is wrapped in `<!-- DRAFT — needs validation -->` comments.

## Future improvements (not done in the initial pass)

- Translate the folder-level READMEs (`apps/README.md`, `domains/README.md`, etc.) to English.
- Add a CI lint job that checks for broken internal links and flags pages whose `Last reviewed` date is older than 12 months.
- Publish this folder to GitLab Pages for in-browser navigation with full-text search.

---

_Last reviewed: 2026-05_
