# Commits and branches

> _What this page covers:_ Conventional Commits enforced by `conventional-pre-commit`, allowed types, branch naming, and how releases bump versions.
> _Who it's for:_ Anyone about to commit or open an MR.

## Conventional Commits

Every commit subject must follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<optional-scope>): <short summary>
```

Examples:

| Good | Why |
|---|---|
| `feat(festival-event): add displayName on festival activity` | New feature, scoped to the domain |
| `fix(assignment): save volunteer list filters in url #2713` | Bug fix referencing an issue |
| `docs: explain how to add a new domain` | Documentation change |
| `chore(deps): update web dependencies` | Dependency bump |
| `refactor(api): inline mapping into the festival-task controller` | Pure refactor |

This is enforced at commit time by `conventional-pre-commit` (see `.pre-commit-config.yaml`). To enable the hook on your machine, run once:

```bash
pnpm ci:init
```

(installs `pre-commit` via Python pip and registers the hooks).

## Allowed types

| Type | Use for | Triggers (per `.releaserc.json`) |
|---|---|---|
| `feat` | New user-facing functionality | minor version bump |
| `fix` | Bug fix | patch bump |
| `major` | Manual major bump | major bump |
| `BREAKING CHANGE` | (As subject prefix or `!` after type) — incompatible change | major bump |
| `test` | Adding or refining tests | patch bump |
| `chore` | Tooling, deps, config (no behavior change) | patch bump |
| `docs` | Documentation only | patch bump |
| `style` | Formatting, whitespace, no behavior change | patch bump |
| `perf` / `performance` | Performance improvement | patch bump |
| `refacto` / `refactor` | Code restructure with no behavior change | patch bump |
| `ci` | GitLab CI / Renovate / pre-commit changes | (no release impact) |
| `prefeat` | Pre-feature work (foundation for an upcoming feat) | patch bump |
| `alpha` | Experimental / behind-flag work | (hidden in changelog) |

`BREAKING CHANGE` can also appear in the **body** to mark a major bump on any commit type:

```text
feat(api): rename /festival-events to /festival-activities

BREAKING CHANGE: clients calling /festival-events must update.
```

## Detect-secrets

The same pre-commit config runs [`detect-secrets`](https://github.com/Yelp/detect-secrets). If you commit something that looks like a secret (API key, password, token), the hook blocks the commit. To allow a known false positive, see the detect-secrets docs on baselines.

## Branches

The repo has a single long-lived branch: **`main`**. Feature branches are short-lived and merge back via MR.

Branch naming is informal; common conventions in the team:

- `feat/<short-description>`
- `fix/<short-description>` or `fix/<issue-number>-short-description`
- `docs/<short-description>`
- `chore/<short-description>`

Use `kebab-case`. Keep them short.

## Pulling

Use rebase to avoid merge commits on `main`:

```bash
git config --global pull.rebase true   # one-time
git pull
```

## See also

- [`docs/conventions/merge-requests.md`](./merge-requests.md) — opening, reviewing, and merging
- [`docs/operations/release-process.md`](../operations/release-process.md) — how versions get bumped from these commits

---

_Last reviewed: 2026-05_
