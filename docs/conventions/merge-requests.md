# Merge requests

> _What this page covers:_ What a good MR looks like in this repo — the GitLab MR template, review expectations, CI gates.
> _Who it's for:_ Anyone opening their first MR (and anyone reviewing).

## The MR template

The repo's MR template (`.gitlab/merge_request_templates/auto-asign.md`) is auto-applied when you open an MR. It looks like this:

```markdown
# Merge to main

Closes #issue

## Checklist

- [ ] Updated /docs if relevant (or N/A) — see docs/README.md#maintenance-contract

/assign me
/assign_reviewer @titouan-joseph @LeoMouyna ...
/unassign_reviewer me
```

The slash commands (`/assign`, `/assign_reviewer`, `/unassign_reviewer`) are GitLab Quick Actions — they auto-assign the MR to you and request reviews from the team.

## Filling it in

| Field | What to put |
|---|---|
| Title | Conventional Commit subject — same shape as your commits (e.g. `feat(festival-event): add displayName on festival activity`) |
| `Closes #issue` | The GitLab issue number, if there is one. Delete the line if not |
| Description | Why the change is needed, how it works at a high level, and anything reviewers should know that the diff doesn't show |
| Doc checkbox | Tick it if you updated `/docs`, or write "N/A" if no doc change is warranted |

Keep the description short. Reviewers will read the code; the description is for context the code can't carry.

## A good MR is small

The team's bias is toward small, single-purpose MRs:

| Size | What's in it |
|---|---|
| ~50–200 lines | Sweet spot — easy to review carefully, easy to revert |
| 200–600 lines | OK for a focused feature with tests |
| > 600 lines | Probably needs to be split — see below |

If your change is big, look for natural seams:
- Refactor first, behavior change second.
- API change first, web integration second.
- New domain skeleton + first use case first, more use cases later.

A reviewer's energy is finite. A 1000-line MR gets a worse review than three 300-line MRs.

## What CI runs

The GitLab pipeline (`.gitlab-ci.yml`) runs on every push to an MR branch:

| Stage | What it checks |
|---|---|
| `pnpm install --frozen-lockfile` | Lockfile is up to date |
| `pnpm lint` | ESLint clean |
| `pnpm prune` | No new unused exports (ts-prune) |
| Per-package `test:unit:ci` | Vitest UTs pass |
| `apps/api` `test:e2e` | API e2e suite passes |
| Build | TypeScript compiles |

Reproduce locally before pushing:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm prune
pnpm --recursive run test:unit:ci
pnpm --filter @overbookd/api run test:e2e
```

## What reviewers look for

- **Layering:** No imports that violate the [dependency hierarchy](../architecture/dependency-hierarchy.md).
- **Tests at the right level:** Domain logic tested in `domains/`; API wiring tested in `apps/api/test/`.
- **DTOs at the boundary:** Domain types don't leak into the HTTP response shape.
- **Consistent patterns:** New code looks like the surrounding code.
- **Doc updates:** If the change moves something documented, the docs move with it. The MR checkbox makes this visible.
- **Conventional Commit subject:** The pre-commit hook should have caught this, but reviewers double-check on squash.

## Squash vs. merge commit

The team typically squash-merges (so each MR becomes one Conventional Commit on `main`). Make sure the squash commit message matches the convention — GitLab uses the MR title by default, which is why your title should follow the format.

If your MR has multiple meaningful commits that should preserve their history (rare), say so in the MR description and merge with `--no-ff` instead.

## After merging

- Delete the source branch (GitLab does this by default if the option is enabled).
- Pull `main` locally with rebase.
- The release flow happens separately — see [`operations/release-process.md`](../operations/release-process.md).

## See also

- [`docs/conventions/commits-and-branches.md`](./commits-and-branches.md)
- [`docs/conventions/testing.md`](./testing.md)
- [`docs/conventions/code-style.md`](./code-style.md)

---

_Last reviewed: 2026-05_
