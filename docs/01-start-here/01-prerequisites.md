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

### Mermaid plugin (required to read these docs)

The diagrams across `docs/` (architecture, request lifecycle, state machines, etc.) are written in [Mermaid](https://mermaid.js.org/). Without the right plugin, your editor renders them as raw ` ```mermaid ` code blocks instead of pictures.

**VS Code** — install [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) (`bierner.markdown-mermaid`):

1. Open the Command Palette (`Cmd/Ctrl+Shift+P`) → **Extensions: Install Extensions**.
2. Search for `Markdown Preview Mermaid Support` and install it.
3. Open any `docs/**/*.md` and hit `Cmd/Ctrl+Shift+V` to preview.

It's already on the workspace's recommended-extensions list (`.vscode/extensions.json`), so VS Code will offer to install it automatically the first time you open the repo.

**WebStorm / IntelliJ IDEA / PhpStorm / RubyMine / etc.** — install the [Mermaid](https://plugins.jetbrains.com/plugin/20146-mermaid) plugin from the JetBrains Marketplace:

1. **Settings / Preferences** → **Plugins** → **Marketplace** tab.
2. Search for `Mermaid` (publisher: JetBrains s.r.o.) and click **Install**.
3. Restart the IDE when prompted.
4. Open any `docs/**/*.md` and switch to the rendered preview (the split-view button in the top-right of the editor).

If the preview still shows raw code after install, make sure the file is recognized as Markdown (the icon in the editor tab should be the Markdown one) and the preview pane is set to **Preview** or **Editor and Preview**, not **Editor only**.

**Other editors** — most modern editors have a Mermaid extension. If yours doesn't, GitLab renders Mermaid blocks natively in the web UI, so you can always read the docs there.

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
