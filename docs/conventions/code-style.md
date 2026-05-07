# Code style

> _What this page covers:_ ESLint, Prettier, ts-prune, and the `pnpm lint` / `pnpm format` / `pnpm prune` commands.
> _Who it's for:_ Anyone whose CI is failing on style or whose IDE is shouting.

## TL;DR

```bash
pnpm lint     # eslint --fix in every package
pnpm format   # prettier --write in every package
pnpm prune    # ts-prune dead-code check
```

All three are recursive (`pnpm --recursive`) and act on every workspace package. CI runs these in non-fixing mode and fails on any diff.

## ESLint

Configuration: `eslint.config.mjs` at the repo root (flat config). Every package extends it.

`pnpm lint` runs `eslint --fix` recursively, so it auto-corrects what it can. The remaining diagnostics are real — fix them before opening an MR.

If your IDE has the ESLint extension wired up (VS Code does, in the recommended extensions), you'll see issues inline.

## Prettier

Configuration: `.prettierrc.json` at the repo root, with `.prettierignore` for exclusions (build outputs, generated files).

`pnpm format` runs `prettier --write` everywhere. Most editors run Prettier on save once configured — recommended.

## ts-prune

[ts-prune](https://github.com/nadeesha/ts-prune) reports unused exports across the TypeScript graph. The `pnpm prune` script runs it recursively.

CI fails if `ts-prune` finds new unused exports. To keep the report clean, either:
- delete the unused export, or
- mark it with the `// ts-prune-ignore-next` comment if it's intentionally kept (rare — explain in a code comment).

## Workspace conventions

Beyond what the linter enforces, the team relies on a few unwritten rules. Common ones:

| Convention | Why |
|---|---|
| Tests are colocated (`*.spec.ts` next to the file under test) | Easy to find, easy to delete together |
| Domain types are `readonly` and constructed via factories | Invariants stay enforced |
| Controllers are thin (no business logic) | Logic belongs in the domain |
| DTOs are flat and serializable | Boundary types, not domain types |
| Use named exports, not default exports | Easier refactoring, better IDE support |
| Prefer `const` over `let`, never `var` | (ESLint enforces this) |

When in doubt, look at how a sibling file does it. Patterns are consistent across packages.

## What CI runs

The GitLab pipeline (`.gitlab-ci.yml`) runs:

- `pnpm install --frozen-lockfile`
- `pnpm lint` (non-fixing)
- `pnpm prune`
- per-package `test:unit:ci` (Vitest) and `test:e2e` (Jest, api only)
- a build to verify nothing is broken type-wise

Run all of these locally before pushing if your MR is large.

## See also

- [`docs/conventions/testing.md`](./testing.md)
- [`docs/reference/tooling.md`](../reference/tooling.md) — links to upstream docs

---

_Last reviewed: 2026-05_
