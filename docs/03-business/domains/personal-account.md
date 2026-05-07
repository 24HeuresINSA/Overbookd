# Domain — personal-account

> _What this page covers:_ Each volunteer's transactions, balance, and the side-economy that runs on them.
> _Who it's for:_ Anyone touching `domains/personal-account` or its API/UI consumers.

<!-- DRAFT — needs validation. Extracted from the codebase; please correct any wording where it differs from how the team talks about these concepts. -->

## Purpose

The festival runs an internal economy: volunteers can deposit money, transfer it to others, buy from the bar, share meals, etc. This domain tracks all of it as transactions on per-volunteer accounts.

## Key concepts

| Concept | What it is |
|---|---|
| **Personal account** | The implicit wallet of a single volunteer. |
| **Balance** | The current signed sum of all transactions on an account. |
| **Transaction** | A typed movement of money. Types: `INITIALIZATION`, `DEPOSIT`, `TRANSFER`, `BARREL`, `PROVISIONS`, `SHARED_MEAL`, `EXTERNAL_EVENT`. |
| **In-debt** | An alerting concept — accounts with negative balance trigger alerts. |
| **Barrel** | A tracked beverage container. Purchases against a barrel debit the buyer's account. |
| **Barrel price** | The configured rate at which a barrel gets billed. |
| **Shared meal** | A meal organized by a chef volunteer; other volunteers shotgun seats and pay the chef their share. |
| **Shotgun** | A first-come-first-served seat reservation for a shared meal. |
| **Alerting / settle-alerting** | Periodic notifications about in-debt accounts. |

## Transaction types

(Source: `TransactionType` enum in `apps/api/prisma/schema.prisma`.)

| Type | What it records |
|---|---|
| `INITIALIZATION` | Initial balance — opening the account |
| `DEPOSIT` | Money added to the account from outside the system |
| `TRANSFER` | Movement between two accounts |
| `BARREL` | Bar purchase against a barrel |
| `PROVISIONS` | Shared provisioning — kitchen, supplies |
| `SHARED_MEAL` | Payment for a seat at a shared meal |
| `EXTERNAL_EVENT` | Pre-festival event ticketing within the system |

## Use cases (in `domains/personal-account/src/`)

| Folder | What it does |
|---|---|
| `transaction/` | Create / list / classify transactions |
| `balance/` | Compute a volunteer's running balance |
| `barrel-prices/` | Manage the configured barrel pricing |
| `meal-sharing/` | Shared meal lifecycle: chef declares, guests shotgun, settle |
| `in-debt/` | Detect and report negative-balance accounts |
| `alerting/`, `settle-alerting/` | Emit periodic alerts to debtor accounts |

## Where the code lives

| Layer | Path |
|---|---|
| Domain logic | [`domains/personal-account/`](../../../domains/personal-account/) |
| API slices | `apps/api/src/transaction/`, `apps/api/src/...` (multiple slices) |
| Prisma models | `Transaction`, `Barrel`, `SharedMeal`, `Shotgun` in [`schema.prisma`](../../../apps/api/prisma/schema.prisma) |

## Open questions for validation

- Is "PROVISIONS" the same as "approvisionnement" — kitchen-side bulk purchases?
- Are shotguns ever rolled back (a seat-holder cancels)?
- What initiates "alerting" — a cron job, a manual trigger, both?

## See also

- [`docs/03-business/domains/contribution.md`](./contribution.md) — yearly fee, distinct from per-festival transactions
- [`docs/03-business/domains/charisma.md`](./charisma.md) — point-based reward system

---

_Last reviewed: 2026-05 — DRAFT_
