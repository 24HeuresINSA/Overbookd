# Overbookd Web

Nuxt 4 SPA frontend for Overbookd. Talks to the API at `/api` via the shared HTTP client.

> **English deep-dive:** [`docs/architecture/web-anatomy.md`](../../docs/architecture/web-anatomy.md)

## Common commands

Run from the repo root:

```bash
pnpm dev:start                           # boots the whole stack incl. web
pnpm --filter @overbookd/web run lint
pnpm --filter @overbookd/web run test:unit
```

The dev frontend is served at [https://overbookd.traefik.me](https://overbookd.traefik.me).

## See also

- [`docs/start-here/02-local-setup.md`](../../docs/start-here/02-local-setup.md) — booting the web locally
- [`docs/conventions/adding-a-web-page.md`](../../docs/conventions/adding-a-web-page.md) — recipe for new pages
- [Nuxt 4 documentation](https://nuxt.com/docs/getting-started/introduction) — upstream framework docs
- ⚠️ Nuxt is currently pinned at ≤ 4.4.2 because 4.4.4 breaks SPAs (`ssr: false`). See [nuxt/nuxt#34957](https://github.com/nuxt/nuxt/issues/34957). Don't bump it without verifying the dev server still serves HTTP 200.
