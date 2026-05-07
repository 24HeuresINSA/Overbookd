# Domain — charisma

> _What this page covers:_ The volunteer reward / point system.
> _Who it's for:_ Anyone touching `domains/charisma` or its API/UI consumers.

<!-- DRAFT — needs validation. Extracted from the codebase; please correct any wording where it differs from how the team talks about these concepts. -->

## Purpose

A volunteer who shows up at events and helps regularly should accumulate recognition. **Charisma** is the points-based system that tracks this. Points are earned by participating in association events and (likely) by working FT shifts during the festival.

## Key concepts

| Concept | What it is |
|---|---|
| **Charisma points** | A non-negative integer balance per user. |
| **Charisma period** | A time window with an associated points-per-something rate. |
| **Charisma event** | A real-world association event (concert, working session, etc.) where attendance grants points. |
| **Charisma event participation** | A logged attendance entry — user X was at event Y. |

## Use cases (in `domains/charisma/src/`)

| Folder | What it does |
|---|---|
| `calculate/` | Aggregate a user's charisma over a period |
| `charisma-event/` | Manage events and their participants |

## Where the code lives

| Layer | Path |
|---|---|
| Domain logic | [`domains/charisma/`](../../../domains/charisma/) |
| API slices | `apps/api/src/charisma-event/`, `apps/api/src/charisma-period/` |
| Prisma models | `CharismaPeriod`, `CharismaEventParticipation` in [`schema.prisma`](../../../apps/api/prisma/schema.prisma) |

## Open questions for validation

- Is charisma awarded only by event attendance, or also by FT shifts during the festival?
- Does the rate change between periods (e.g. "everything counts double during festival week")?
- What does charisma unlock — priority assignment, social rewards, both?
- Can charisma be taken away (penalty), or only added?

## See also

- [`docs/business/domains/personal-account.md`](./personal-account.md) — separate concept (money, not points)
- [`docs/business/domains/festival-event.md`](./festival-event.md) — where shifts happen during the festival

---

_Last reviewed: 2026-05 — DRAFT_
