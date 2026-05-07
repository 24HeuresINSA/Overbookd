# 5. Troubleshooting

> _What this page covers:_ The setup errors people actually hit on this repo, with fixes.
> _Who it's for:_ Anyone stuck during local setup or first run.

If your specific symptom isn't listed here, check [`docs/operations/local-dev-gotchas.md`](../operations/local-dev-gotchas.md) for the deeper list.

## `pnpm dev:init` aborts immediately

### Symptom

```text
Error response from daemon: network with name traefik-public already exists
```

### Cause

`dev:init` calls `docker network create traefik-public` unconditionally. On a second run it errors because the network exists.

### Fix

This script is one-time. After the first successful run, use:

```bash
pnpm install && pnpm dev:build
```

instead of `pnpm dev:init`.

---

## `pnpm dev:init` aborts with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`

### Symptom

`pnpm install` (run by `dev:init`) aborts and refuses to remove `node_modules`.

### Cause

The host's `node_modules` was populated earlier by a different OS / arch (e.g. you ran `pnpm install` _inside_ the container before, or copied across machines). Native deps (`bcrypt`, `esbuild`, `@parcel/watcher`, `@prisma/client`, `unrs-resolver`) are arch-specific and break this way.

### Fix

```bash
rm -rf node_modules .pnpm-store
find . -type d \( -name 'node_modules' -o -name '.pnpm-store' \) -not -path '*/docker/*' -prune -exec rm -rf {} +
pnpm install
pnpm dev:build
```

There's also a `pnpm dev:clean` script that does this (and more).

---

## API container fails with `Cannot find module '@prisma/client'`

### Symptom

`pnpm dev:logs` shows the api container crashing with a missing-module error referencing Prisma.

### Cause

The Prisma client is generated into `apps/api/src/generated/prisma`. If you skipped `db:seed` (which runs `prisma generate`), the client doesn't exist yet.

### Fix

```bash
pnpm db:generate
```

If the schema changed in a recent merge, also re-run migrations:

```bash
pnpm db:migrate
```

---

## `https://overbookd.traefik.me` shows a certificate warning

### Cause

You haven't trusted the Traefik root CA yet, or your browser uses its own certificate store (Firefox).

### Fix

Follow the per-OS / per-browser instructions in [`02-local-setup.md` → Trust the certificate](./02-local-setup.md#trust-the-certificate).

For Firefox specifically: it has its own trust store, so the system-level install does nothing. You must import `rootCA.pem` via Firefox preferences.

---

## `*.traefik.me` does not resolve at all

### Symptom

`ping overbookd.traefik.me` returns `cannot resolve` or times out.

### Cause

The `traefik.me` wildcard DNS service ([github.com/pyrou/traefik.me](https://github.com/pyrou/traefik.me)) is occasionally down.

### Fix

Add to `/etc/hosts`:

```text
127.0.0.1   overbookd.traefik.me
127.0.0.1   mail.traefik.me
127.0.0.1   traefik.traefik.me
```

---

## On macOS, the api/web containers see an empty mount

### Symptom

`pnpm dev:logs` shows containers complaining they can't find `package.json` or `apps/`. `docker exec overbookd_api ls /overbookd` is empty.

### Cause

On macOS, Docker Desktop / OrbStack need explicit **Files and Folders** permission for `~/Documents`. Without it the bind mount silently mounts an empty directory.

### Fix

System Settings → Privacy & Security → Files and Folders → grant access to OrbStack (or Docker) for **Documents**. Restart Docker, then `pnpm dev:restart`.

---

## `pnpm install` is rejected with `Use pnpm`

### Symptom

```text
ERR_PNPM_NPM_NOT_ALLOWED  Use "pnpm install" instead.
```

### Cause

The repo's `preinstall` script runs `only-allow pnpm` to enforce a single package manager. You ran `npm install` or `yarn install`.

### Fix

```bash
corepack enable
corepack prepare pnpm@10.33.2 --activate
pnpm install
```

---

## Adminer login fails

### Symptom

The Adminer login at [https://overbookd.traefik.me/adminer/](https://overbookd.traefik.me/adminer/) refuses your credentials.

### Cause

Adminer doesn't have a default profile — you need to fill the form.

### Fix

| Field | Value |
|---|---|
| System | PostgreSQL |
| Server | `overbookd_postgresql` |
| Username | `overbookd` |
| Password | `password` |
| Database | `overbookd-local` |

Or use the magic-link query string for autofill: [https://overbookd.traefik.me/adminer/?pgsql=overbookd_postgresql&username=overbookd&db=overbookd-local&ns=public](https://overbookd.traefik.me/adminer/?pgsql=overbookd_postgresql&username=overbookd&db=overbookd-local&ns=public).

---

## A pre-commit hook is rejecting my commit

### Symptom

`git commit` fails with a message about Conventional Commits or a hook script.

### Cause

`.pre-commit-config.yaml` enforces `conventional-pre-commit` on commit messages. Allowed types: `feat, fix, major, BREAKING CHANGE, test, chore, docs, style, perf, performance, refacto, refactor, ci, prefeat, alpha`.

### Fix

Reword your commit message to match the conventional format:

```text
<type>(<optional-scope>): <short summary>
```

Examples:
- `feat(festival-event): add displayName on festival activity`
- `fix(assignment): save volunteer list filters in url #2713`
- `docs: explain how to add a new domain`

If you've never run `pnpm ci:init`, the hooks aren't installed. Run it once:

```bash
pnpm ci:init
```

---

## My change works locally but CI is red

### Common reasons

| What's red | Where to look |
|---|---|
| Lint | `pnpm lint` locally — same config as CI |
| UT | `pnpm --filter @overbookd/<package> run test:unit:ci` (CI mode, no watch) |
| API e2e | `pnpm --filter @overbookd/api run test:e2e` |
| ts-prune (dead code) | `pnpm prune` |
| Conventional commit | The pre-commit hook should have caught this — make sure `pnpm ci:init` ran |

For deeper digging, look at the failing job in the GitLab pipeline (`.gitlab-ci.yml` describes each stage).

---

## Still stuck?

- Search the GitLab issues at [`24-heures-insa/overbookd-mono/-/issues`](https://gitlab.com/24-heures-insa/overbookd-mono/-/issues) — someone may have hit the same thing.
- Ask on the team chat. Other contributors are the best debugging resource.

## See also

- [`docs/operations/local-dev-gotchas.md`](../operations/local-dev-gotchas.md) — deeper version of this page

---

_Last reviewed: 2026-05_
