# 1. Prerequisites

> _What this page covers:_ The tools, accounts, and access you need before doing anything else.
> _Who it's for:_ A new contributor on day one.

You should be able to install all of this in under an hour.

## Accounts and access

| What | Why | How |
|---|---|---|
| GitLab account | The repo is hosted at [`24-heures-insa/overbookd-mono`](https://gitlab.com/24-heures-insa/overbookd-mono) | Create one on [gitlab.com](https://gitlab.com), then ask the team lead to add you to the `24-heures-insa` group |
| SSH key on GitLab | Cloning over SSH | `ssh-keygen -t ed25519 -C "you@example.com"` then add `~/.ssh/id_ed25519.pub` to GitLab → Preferences → SSH Keys |
| Access to the `infra` repo (optional, deploy-only) | Reading the deployment configs | Same group access — ask the team lead |

## Local tools

The repo pins exact versions in `package.json` (`engines.node` and `packageManager`). Mismatched versions cause subtle failures, so use a version manager.

| Tool | Required version | Recommended install |
|---|---|---|
| **Node.js** | exactly `24.15.0` | [`mise`](https://mise.jdx.dev/) (`mise use node@24.15.0`) or [`nvm`](https://github.com/nvm-sh/nvm) (`nvm install 24.15.0`) |
| **pnpm** | exactly `10.33.2` | `corepack enable && corepack prepare pnpm@10.33.2 --activate` |
| **Docker** | latest stable | macOS: [OrbStack](https://orbstack.dev/) (lighter than Docker Desktop); Linux: Docker Engine; Windows: Docker Desktop with WSL 2 |
| **git** | any modern (≥ 2.30) | OS package manager |

The repo blocks `npm install` and `yarn install` via `preinstall` (`only-allow pnpm`) — this is intentional, don't fight it.

## Editor

VS Code is what most of the team uses. The repo ships a `.vscode/` folder with recommended extensions and a `.devcontainer/` folder if you want to develop entirely in a container. Neither is required.

## macOS-only setup

If your repo lives under `~/Documents`, OrbStack / Docker Desktop need explicit **Files and Folders** permission to read the bind-mounted source — otherwise the api/web containers will see an empty mount and fail strangely.

Open **System Settings → Privacy & Security → Files and Folders → OrbStack (or Docker)** and grant access to **Documents**.

## What's next

Move on to [`02-local-setup.md`](./02-local-setup.md) to actually boot the app.

## See also

- [`docs/05-operations/local-dev-gotchas.md`](../05-operations/local-dev-gotchas.md) — pitfalls people actually hit
- [`docker/README.md`](../../docker/README.md) — French companion doc with extra details on certificates

---

_Last reviewed: 2026-05_
