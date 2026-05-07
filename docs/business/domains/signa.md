# Domain — signa

> _What this page covers:_ Signage and signaletics on the festival site.
> _Who it's for:_ Anyone touching `domains/signa` or its API/UI consumers.

<!-- DRAFT — needs validation. Extracted from the codebase; please correct any wording where it differs from how the team talks about these concepts. -->

## Purpose

The festival site needs signs — directional markers, info panels, branding banners, etc. This domain owns the catalog of signage definitions and the mapping between signs and their physical locations on the festival grounds.

## Key concepts

| Concept | What it is |
|---|---|
| **Signa** (singular) | A single sign — a physical object placed on site. Short for "signalétique". |
| **Catalog signage** | A reusable signage template — what kind of sign, dimensions, content, image. |
| **Signa location** | A georeferenced spot on the festival grounds where signage is placed. |
| **Festival activity signage** | An FA's request for specific signage at specific locations. |

## Use cases (in `domains/signa/src/`)

| Folder | What it does |
|---|---|
| `location/` | Manage signa locations on the festival map |
| `signage/` | Manage catalog signage definitions |

## Where the code lives

| Layer | Path |
|---|---|
| Domain logic | [`domains/signa/`](../../../domains/signa/) |
| API slices | `apps/api/src/catalog-signage/`, `apps/api/src/location/` |
| Prisma models | `SignaLocation`, `CatalogSignage`, `FestivalActivitySignage` in [`schema.prisma`](../../../apps/api/prisma/schema.prisma) |

## Open questions for validation

- Are sign locations editable on a map UI, or entered as raw coordinates?
- Who fulfills a signa request — the signa team prints and places, or the FA's instigator?
- Is there an inventory of "signs we already have" vs. "signs to print", or is everything reprinted per edition?

## See also

- [`docs/business/domains/festival-event.md`](./festival-event.md) — FAs request signage via inquiry requests
- [`docs/business/domains/logistic.md`](./logistic.md) — sister domain for gear

---

_Last reviewed: 2026-05 — DRAFT_
