# Domain-driven layout

> _What this page covers:_ Bounded contexts in `domains/`, anatomy of a domain folder, and how to read the canonical `festival-event` example.
> _Who it's for:_ Anyone touching a domain or wondering "where does this logic belong".

## Bounded contexts

Each folder under `domains/` is a **bounded context** in the DDD sense:

- It has its own ubiquitous language (a "volunteer" in `assignment` is not the same shape as a "volunteer" in `registration`).
- It does not import from any other domain.
- It is the source of truth for the rules and invariants of its slice of the business.

| Domain | What it owns |
|---|---|
| `festival-event` | Festival activities (FA) and festival tasks (FT) — the catalog of "things happening" |
| `assignment` | Assigning volunteers to FT timeslots |
| `registration` | Volunteer signup, onboarding, profile |
| `volunteer-availability` | When a volunteer can work — input to assignment |
| `personal-account` | A volunteer's transactions and balance |
| `contribution` | Volunteer contributions (membership fees, etc.) |
| `charisma` | The volunteer reward / point system |
| `signa` | Signage and signaletics on the festival site |
| `logistic` | Gear and equipment used during the festival |
| `access-manager` | Roles, permissions, teams |

For "what does each one mean in festival terms" see [`docs/03-business/`](../03-business/README.md).

## Anatomy of a domain

The largest and most representative example is `domains/festival-event/`. Open it and you'll see this shape (truncated):

```text
domains/festival-event/
├── package.json                       # @overbookd/festival-event
├── tsconfig.json
└── src/
    ├── index.ts                       # Public API of the package
    ├── festival-event.ts              # Top-level type / factory
    ├── common/                        # Shared internals
    ├── festival-activity/             # Sub-aggregate
    │   ├── festival-activity.ts            # Type
    │   ├── festival-activity.factory.ts    # Constructors
    │   ├── festival-activity.fake.ts       # Test doubles
    │   ├── festival-activity.error.ts      # Domain errors
    │   ├── festival-activity.event.ts      # Domain events
    │   ├── creation/                       # Use case folder
    │   │   ├── creation.ts
    │   │   └── creation.spec.ts            # UT colocated
    │   ├── reviewing/
    │   ├── preparation/
    │   ├── ask-for-review/
    │   ├── sections/
    │   ├── preview-of.ts
    │   └── preview-of.spec.ts
    └── festival-task/                 # Sister sub-aggregate
```

Five patterns recur across every domain:

### 1. Use cases as folders

Each user-facing scenario gets its own folder: `creation/`, `reviewing/`, `preparation/`, `ask-for-review/`. Inside, a single `<name>.ts` plus its `<name>.spec.ts`.

This makes the domain map onto features in a way that's obvious from the file tree alone.

### 2. Specs colocated

Tests live next to the code (`*.spec.ts`), not in a separate `tests/` tree. Move the file, move the test.

### 3. Factories and fakes

Each aggregate has:
- `*.factory.ts` — typed constructors that enforce invariants. Always call this, never construct the object inline in a use case.
- `*.fake.ts` — test doubles with a fluent builder. Lives in the domain itself so other domains' tests can borrow it.

### 4. Errors as types

`*.error.ts` defines domain errors as classes. Use cases throw them; the API layer catches and maps them to HTTP status codes.

### 5. Events

`*.event.ts` defines domain events emitted on state changes. They cross the API → web boundary via `utils/domain-events`.

## When to add a new domain

Add a new domain when:

- You're modeling a slice of festival reality the existing domains don't cover (e.g. a new system for scheduling outside the festival weekend).
- You want different invariants on the same word (e.g. "volunteer" in two different lifecycles).

Do **not** add a new domain when:

- It's just a UI feature → stays in `apps/web`.
- It's a calculation reusable across domains → goes in `libraries/`.
- It's app-specific glue → goes in `utils/`.

The recipe lives in [`docs/04-conventions/adding-a-domain.md`](../04-conventions/adding-a-domain.md).

## See also

- [`docs/02-architecture/dependency-hierarchy.md`](./dependency-hierarchy.md)
- [`docs/03-business/`](../03-business/README.md) — what each domain represents in festival terms
- [`docs/04-conventions/testing.md`](../04-conventions/testing.md) — UT discipline in domains

---

_Last reviewed: 2026-05_
