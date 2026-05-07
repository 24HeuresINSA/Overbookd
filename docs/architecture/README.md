# Architecture

> _What this page covers:_ How the code is laid out, why, and how a request flows end-to-end.
> _Who it's for:_ Anyone designing or reviewing changes that cross more than one file.

| Page | Topic |
|---|---|
| [Dependency hierarchy](./dependency-hierarchy.md) | The `constants → libraries → domains → utils → apps` rule and what enforces it |
| [Domain-driven layout](./domain-driven-layout.md) | Bounded contexts, anatomy of a domain folder, the `festival-event` reference example |
| [API anatomy](./api-anatomy.md) | NestJS module pattern, controllers, DTOs, wiring to domain use cases |
| [Web anatomy](./web-anatomy.md) | Nuxt 4 SPA structure, components, composables, stores, API client |
| [Data model](./data-model.md) | Prisma schema, generated client, migration workflow |
| [Request lifecycle](./request-lifecycle.md) | A real GET request walked end-to-end |

---

_Last reviewed: 2026-05_
