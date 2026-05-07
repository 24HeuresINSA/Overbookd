# Domain — logistic

> _What this page covers:_ Gear and equipment used during the festival.
> _Who it's for:_ Anyone touching `domains/logistic` or its API/UI consumers.

<!-- DRAFT — needs validation. Extracted from the codebase; please correct any wording where it differs from how the team talks about these concepts. -->

## Purpose

FAs and FTs need gear — tables, sound systems, fridges, generators, tools. Some is owned by the association and rented out internally, some has to be bought new. This domain tracks the catalog, inventory, and per-FA requests.

## Key concepts

| Concept | What it is |
|---|---|
| **Catalog gear** | A reusable equipment definition (one type of cup, one make of speaker, etc.). |
| **Catalog category** | A bucket grouping similar gear items. |
| **Inventory record** | A snapshot of how much of a catalog gear is on hand. |
| **Gear request** | A request attached to an FA/FT for gear. Either a borrow or a purchase. |
| **Borrow** | Request to borrow association-owned gear for a window. |
| **Purchase** | Request to buy new gear (may go through association procurement). |

## Use cases (in `domains/logistic/src/`)

| Folder / file | What it does |
|---|---|
| `borrow/` | Manage borrow requests |
| `purchase/` | Manage purchase requests |
| `gear-request.ts` | Common gear-request abstraction |
| `logistic.error.ts` | Domain errors |

## Where the code lives

| Layer | Path |
|---|---|
| Domain logic | [`domains/logistic/`](../../../domains/logistic/) |
| API slice | [`apps/api/src/logistic/`](../../../apps/api/src/logistic/) |
| Prisma models | `CatalogCategory`, `CatalogGear`, `InventoryRecord`, `Borrow`, `BorrowGearRequest`, `Purchase`, `PurchaseGearRequest` in [`schema.prisma`](../../../apps/api/prisma/schema.prisma) |

## Open questions for validation

- Is "InventoryRecord" a running ledger (one row per state change) or a snapshot (one row per item, updated)?
- Who approves a purchase request — automatic above a threshold, manual always?
- How is gear that's borrowed across overlapping FAs handled?

## See also

- [`docs/03-business/domains/festival-event.md`](./festival-event.md) — FAs/FTs raise inquiry requests
- [`docs/03-business/domains/signa.md`](./signa.md) — sister domain for signage

---

_Last reviewed: 2026-05 — DRAFT_
