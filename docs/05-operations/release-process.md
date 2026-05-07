# Release process

> _What this page covers:_ How versions are bumped, what triggers a deploy, and what the `release:*` scripts actually do.
> _Who it's for:_ Anyone cutting a release.

## The tools

| Tool | Role |
|---|---|
| [Conventional Commits](https://www.conventionalcommits.org/) | Commits encode their kind in the subject. The pre-commit hook enforces this. |
| [`commit-and-tag-version`](https://github.com/absolute-version/commit-and-tag-version) | Reads commit history, decides the next version, updates package files, generates CHANGELOG.md, creates a git tag. |
| `pnpm` workspace filters | Bump dependent packages together via `--recursive --filter` flags. |
| `.releaserc.json` | Configures release rules — which commit types bump which kind of version. |

## The release scripts

Run from the repo root.

| Command | Effect |
|---|---|
| `pnpm release:patch` | Patch bump (e.g. `3.53.5` → `3.53.6`). For bug fixes and chores. |
| `pnpm release:minor` | Minor bump (e.g. `3.53.5` → `3.54.0`). For new features. |
| `pnpm release:major` | Major bump (e.g. `3.53.5` → `4.0.0`). For breaking changes. |
| `pnpm release:candidate` | Bump as `-rc` prerelease (e.g. `3.53.6-rc.0`). |

Each `release:<level>` script:

1. `git fetch -ap` — refresh remote refs.
2. `pnpm run version:<level>-dependency` — bump the dependency packages (`apps/api`, `apps/web`, …) that have new commits relative to `origin/main`.
3. `pnpm run version:bump-dependent` — bump the packages that consume those dependents.
4. `pnpm run release:candidate` — create the prerelease version.
5. `pnpm run dev:sync-version` — restart the local dev containers so they pick up the new version (no-op outside dev).

There are `:no-sync` variants (e.g. `release:patch:no-sync`) that skip the local restart — use those on CI or release runners.

## What gets a version bump

The release rules from `.releaserc.json`:

| Commit type | Bump |
|---|---|
| `feat` | minor |
| `fix` | patch |
| `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `prefeat` | patch |
| Anything with `BREAKING CHANGE`, `BREAKING CHANGES`, or `NEW EDITION` in the body | major |

Commits without a recognized type (or with `alpha`) skip release-note inclusion.

## Cutting a release — step by step

1. Make sure `main` is green (CI passing) and your local checkout is up to date:

   ```bash
   git checkout main && git pull --ff-only
   ```

2. Pick the right level. If unsure, `pnpm release:patch`.

3. Run the script:

   ```bash
   pnpm release:patch
   ```

4. Review the diff (`CHANGELOG.md` updates, version bumps in `package.json` files, the new tag).

5. Push the commit and the tag:

   ```bash
   git push --follow-tags origin main
   ```

6. Confirm the deployment:
   - The CI pipeline builds the new images.
   - The deployment trigger lives in the [`infra` repo](https://gitlab.com/24-heures-insa/infra) — typically pulling the new image and recreating the compose stack on the target environment.

## Troubleshooting

### `pnpm release:*` reports nothing to bump

`commit-and-tag-version` only sees commits since the last tag. If you forgot to fetch tags, it may think there are no new commits. `git fetch --tags` first.

### CHANGELOG.md edit conflicts

If two release attempts run in parallel, the regenerated CHANGELOG can conflict. Resolve by re-running `pnpm release:<level>` from a clean state — the script regenerates the section deterministically from commit history.

### Per-package versions drift

This monorepo has a root version in `package.json` plus per-package versions in `apps/api/package.json`, `apps/web/package.json`, each domain, etc. The `version:bump-dependent` step exists to keep them aligned. If a package was added recently and isn't getting bumped, check that its `package.json` has a `version:patch` script (look at a working sibling for the pattern).

## See also

- [`docs/04-conventions/commits-and-branches.md`](../04-conventions/commits-and-branches.md) — Conventional Commits rules
- [`docs/05-operations/deployment-topology.md`](./deployment-topology.md) — what happens after the tag is pushed
- [`.releaserc.json`](../../.releaserc.json) — the release rules

---

_Last reviewed: 2026-05_
