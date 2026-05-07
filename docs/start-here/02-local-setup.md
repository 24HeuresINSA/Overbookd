# 2. Local setup

> _What this page covers:_ Booting Overbookd on your machine — Docker, Traefik, database seed, certificate trust.
> _Who it's for:_ A new contributor who has installed the [prerequisites](./01-prerequisites.md).

The whole stack runs in Docker, fronted by Traefik on the `*.traefik.me` wildcard domain. There is no `npm run dev` to run on the host — the host only orchestrates Docker.

## TL;DR

```bash
git clone git@gitlab.com:24-heures-insa/overbookd-mono.git
cd overbookd-mono

pnpm dev:init        # one-time: traefik network + dependencies + dev image
pnpm dev:start       # boot the stack
pnpm db:seed         # one-time: generate Prisma client + seed the local DB
```

Then trust the Traefik root CA (one-time, see [Trust the certificate](#trust-the-certificate) below) and open [https://overbookd.traefik.me](https://overbookd.traefik.me).

The rest of this page explains each step and what to do if it doesn't work.

## Step by step

### 1. Clone the repo

```bash
git clone git@gitlab.com:24-heures-insa/overbookd-mono.git
cd overbookd-mono
```

If your SSH key isn't set up, see [`01-prerequisites.md`](./01-prerequisites.md#accounts-and-access).

### 2. `pnpm dev:init`

This script:
1. Creates the `traefik-public` Docker network.
2. Runs `pnpm install` on the host to populate `node_modules` for IDE/typecheck use.
3. Builds the `overbookd:dev` Docker image used by all dev containers.

```bash
pnpm dev:init
```

⚠️ **Not idempotent.** If the `traefik-public` network already exists, `docker network create` errors and the script aborts. Either ignore the error or, on subsequent setups, just run `pnpm install && pnpm dev:build`.

### 3. `pnpm dev:start`

```bash
pnpm dev:start
```

Boots six containers via `docker/docker-compose.yml`:

| Container | What it does |
|---|---|
| `traefik` | Reverse proxy, terminates TLS, routes `*.traefik.me` to the right service |
| `certs-downloader` | Pulls the dev TLS cert from the `infra` repo into a shared volume |
| `api` | NestJS backend, mounts the repo as `/overbookd` so code changes hot-reload |
| `web` | Nuxt 4 SPA, same bind mount as `api` |
| `postgresql` | Local Postgres, data persisted under `docker/data/postgresql/` |
| `mail_catcher` | SMTP catcher served at `mail.traefik.me` for testing transactional email |
| `adminer` | Postgres web UI at `/adminer/` |

### 4. Seed the database

```bash
pnpm db:seed
```

Runs `prisma generate` then `prisma db seed` inside the api container. You only need this once on a fresh DB.

### 5. Trust the certificate

Traefik serves HTTPS via a custom local CA (so `*.traefik.me` is "valid" in your browser). You need to install that CA into your trust store **once per machine**. Pick the section that matches your OS / browser.

#### macOS

```bash
curl -O https://gitlab.com/24-heures-insa/infra/-/raw/main/data/traefik/certs/rootCA.pem
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain rootCA.pem
```

#### Linux

```bash
sudo wget https://gitlab.com/24-heures-insa/infra/-/raw/main/data/traefik/certs/rootCA.pem -O /usr/local/share/ca-certificates/traefik.me-root-CA-local.crt
sudo update-ca-certificates
sudo apt install -y libnss3-tools
certutil -d sql:$HOME/.pki/nssdb/ -A -t "C,," -n "traefik-local-ca" -i /usr/local/share/ca-certificates/traefik.me-root-CA-local.crt
```

#### Windows

Download [`rootCA.pem`](https://gitlab.com/24-heures-insa/infra/-/raw/main/data/traefik/certs/rootCA.pem), open the file, click **Install Certificate** → **Local Machine** → **Trusted Root Certification Authorities**.

#### Firefox (any OS)

Firefox uses its own trust store. In `about:preferences` → search "certificates" → **View Certificates** → **Authorities** → **Import…** → select the downloaded `rootCA.pem` → tick "Trust this CA to identify websites".

> The full procedure with screenshots also lives in [`docker/README.md`](../../docker/README.md) (in French).

## Verify it works

| URL | Should show |
|---|---|
| [https://overbookd.traefik.me](https://overbookd.traefik.me) | The Overbookd web app |
| [https://overbookd.traefik.me/api/swagger](https://overbookd.traefik.me/api/swagger) | Swagger UI for the API |
| [https://overbookd.traefik.me/adminer/](https://overbookd.traefik.me/adminer/?pgsql=overbookd_postgresql&username=overbookd&db=overbookd-local&ns=public) | Postgres web UI (use the magic-link query string for autofill, password is `password`) |
| [https://mail.traefik.me](https://mail.traefik.me) | Mailcatcher inbox for emails sent from the app |

If `*.traefik.me` does not resolve, the `traefik.me` wildcard DNS service is occasionally down. Add the following to `/etc/hosts`:

```text
127.0.0.1   overbookd.traefik.me
127.0.0.1   mail.traefik.me
127.0.0.1   traefik.traefik.me
```

## Day-to-day commands

| Command | What it does |
|---|---|
| `pnpm dev:start` | Boot the stack (detached) |
| `pnpm dev:stop` | Stop the stack but keep containers |
| `pnpm dev:restart` | Restart all containers |
| `pnpm dev:down` | Stop and remove containers |
| `pnpm dev:logs` | Tail logs from all containers |
| `pnpm dev:bash` | Spawn an interactive shell inside a one-shot dev container with the repo mounted |
| `pnpm db:migrate` | Run `prisma migrate dev` inside the api container |
| `pnpm db:reset` | Reset the DB and re-seed (destructive) |
| `pnpm db:exec '<cmd>'` | Run any prisma command inside the api container |

The full annotated table is in [`docs/reference/scripts.md`](../reference/scripts.md).

## When things go wrong

Jump to [`05-troubleshooting.md`](./05-troubleshooting.md). The most common first-run errors are:

- `pnpm dev:init` aborts because the `traefik-public` network already exists → expected, see step 2.
- `pnpm dev:init` aborts with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` → wipe host `node_modules` and `.pnpm-store`, retry.
- The api container starts but logs `Cannot find module @prisma/client` → run `pnpm db:generate`.
- The api container sees an empty `/overbookd` mount → grant Files and Folders permission to OrbStack/Docker on macOS.

## See also

- [`03-repo-tour.md`](./03-repo-tour.md) — once the app is running, learn the repo
- [`docs/operations/local-dev-gotchas.md`](../operations/local-dev-gotchas.md) — deeper dive into common pitfalls

---

_Last reviewed: 2026-05_
