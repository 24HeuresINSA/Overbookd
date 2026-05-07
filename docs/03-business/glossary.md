# Glossary

> _What this page covers:_ A–Z list of festival-specific terms with one-line definitions, French ↔ English mappings, and links to the relevant domain pages.
> _Who it's for:_ Anyone reading code or tickets and seeing a term they don't recognize.

<!-- DRAFT — needs validation. Definitions below were extracted from the codebase (constants, domain folders, Prisma schema). Please review and correct any term where the meaning differs from how the team uses it. -->

> Note for newcomers: terms in **bold** appear in code as constants, types, or model names; terms in _italic_ are colloquial. Many short codes (FA, FT, …) come from French and are used as-is in code.

## Core terms

| Term | Aliases | One-line definition | Domain |
|---|---|---|---|
| **24h INSA** | _24 Heures de l'INSA_ | The annual student festival run by the Club des 24 heures de l'INSA at INSA Lyon | n/a |
| **Bénévole** | volunteer | A person who signs up to help during the festival, in exchange for participation rights | [`registration`](./domains/registration.md), [`personal-account`](./domains/personal-account.md) |
| **Festivalier** | festival-goer | A paying attendee of the festival (distinct from a bénévole) | n/a |
| **Édition** | edition | One yearly run of the festival | n/a |
| **Membre** | member | A person registered in the system, regardless of role | [`registration`](./domains/registration.md) |
| **Adhérent** | member with paid contribution | A member who has paid the annual contribution | [`contribution`](./domains/contribution.md) |
| **Staff** | staff | A long-term association member, distinct from a one-time volunteer | [`registration`](./domains/registration.md), [`access-manager`](./domains/access-manager.md) |

## Festival activities and tasks

| Term | Aliases | One-line definition | Domain |
|---|---|---|---|
| **FA** | Festival Activity, _activité_ | A unit of "something happening at the festival" — concert, workshop, food stand, etc. Owns timeslots, signage, electricity needs | [`festival-event`](./domains/festival-event.md) |
| **FT** | Festival Task, _tâche_ | A volunteer-staffable shift within or supporting an FA — has timeslots, mobilization needs, location | [`festival-event`](./domains/festival-event.md) |
| **Time window** | _créneau_ | A start–end time interval. FAs and FTs are made of one or more | [`festival-event`](./domains/festival-event.md) |
| **Mobilization** | _mobilisation_ | An FT's request for N volunteers (optionally constrained by team) to cover a time window | [`festival-event`](./domains/festival-event.md), [`assignment`](./domains/assignment.md) |
| **Status** | _statut_ | An FA/FT lifecycle state: `DRAFT` (Brouillon) → `IN_REVIEW` (Relecture en cours) → `VALIDATED` (Validée) / `REFUSED` (Refusée) → `READY_TO_ASSIGN` (Prête pour affectation) | [`festival-event`](./domains/festival-event.md) |
| **Review** | _relecture_ | A team's verdict on an FA/FT: `REVIEWING` (À relire) / `APPROVED` (Approuvée) / `REJECTED` (Rejetée) / `NOT_ASKING_TO_REVIEW` (Pas de relecture) / `WILL_NOT_REVIEW` (Ne va pas relire) | [`festival-event`](./domains/festival-event.md) |
| **Instigator** | _instigateur_ | The user who created an FA or FT — has implicit edit rights | [`festival-event`](./domains/festival-event.md) |
| **Inquiry request** | _demande matériel_ | A request for gear or signage attached to an FA/FT | [`festival-event`](./domains/festival-event.md), [`logistic`](./domains/logistic.md) |
| **Category** | _catégorie de tâche_ | A bucket grouping FTs: `STATIQUE`, `BAR`, `MANUTENTION`, `FUN`, `RELOU`, `COLLAGE` | [`festival-event`](./domains/festival-event.md) |

## Volunteer lifecycle

| Term | Aliases | One-line definition | Domain |
|---|---|---|---|
| **Newcomer** | _nouveau bénévole_ | A registration-form submission awaiting onboarding | [`registration`](./domains/registration.md) |
| **Membership application** | _demande d'adhésion_ | A request to become a recognized member, often gated by approval | [`registration`](./domains/registration.md), [`access-manager`](./domains/access-manager.md) |
| **Availability** | _disponibilité_ | A time window during which a volunteer declares they can work | [`volunteer-availability`](./domains/volunteer-availability.md) |
| **Break period** | _pause_ | A volunteer-declared rest interval — never gets assigned | [`volunteer-availability`](./domains/volunteer-availability.md) |
| **Assignment** | _affectation_ | The fact of assigning a specific volunteer to a specific FT mobilization slot | [`assignment`](./domains/assignment.md) |
| **Assignee** | _affecté_ | A volunteer assigned to an FT | [`assignment`](./domains/assignment.md) |
| **Friend** | _ami_ | Two volunteers linked so the assignment engine tries to put them together | [`assignment`](./domains/assignment.md) |
| **Stack / Fragmented / No-rest** | _empilé / fragmenté / non-stop_ | Volunteer assignment preferences: prefer back-to-back shifts / prefer spread out / accept no rest | [`assignment`](./domains/assignment.md) |

## Money and reward

| Term | Aliases | One-line definition | Domain |
|---|---|---|---|
| **Contribution** | _adhésion_ | The (small) yearly fee a member pays to be considered an adhérent | [`contribution`](./domains/contribution.md) |
| **Personal account** | _compte personnel_ | A volunteer's transaction history — deposits, transfers, food/barrel purchases | [`personal-account`](./domains/personal-account.md) |
| **Transaction** | _transaction_ | A signed money movement between two volunteers, or a purchase | [`personal-account`](./domains/personal-account.md) |
| **Barrel** | _fût_ | A tracked beverage container — purchases against a barrel are a transaction type | [`personal-account`](./domains/personal-account.md) |
| **Shared meal** | _repas partagé_ | A meal organized by a chef volunteer; other volunteers shotgun a seat | [`personal-account`](./domains/personal-account.md) |
| **Shotgun** | _shotgun_ | A first-come-first-served reservation for a seat at a shared meal | [`personal-account`](./domains/personal-account.md) |
| **Charisma** | _charisme_ | A point system rewarding volunteers for participating in events through the year | [`charisma`](./domains/charisma.md) |
| **Charisma period** | _période de charisme_ | A time window during which a charisma rate applies | [`charisma`](./domains/charisma.md) |
| **Charisma event participation** | _participation à un événement charisme_ | A user's recorded attendance at an event that grants charisma points | [`charisma`](./domains/charisma.md) |

## Site, gear, signage

| Term | Aliases | One-line definition | Domain |
|---|---|---|---|
| **Signa** | _signalétique_ | The signage at the festival — directional signs, info panels | [`signa`](./domains/signa.md) |
| **Catalog signage** | _catalogue signalétique_ | A reusable signage definition (template) | [`signa`](./domains/signa.md) |
| **Signa location** | _emplacement signalétique_ | A geographic point where signage is placed on the festival grounds | [`signa`](./domains/signa.md) |
| **Catalog gear** | _catalogue matériel_ | A reusable equipment / gear definition | [`logistic`](./domains/logistic.md) |
| **Borrow** | _emprunt_ | A request to borrow gear for an FA/FT | [`logistic`](./domains/logistic.md) |
| **Purchase** | _achat_ | A request to buy new gear for an FA/FT | [`logistic`](./domains/logistic.md) |
| **Inventory record** | _état d'inventaire_ | A quantity-on-hand snapshot for a catalog gear item | [`logistic`](./domains/logistic.md) |

## Access control

| Term | Aliases | One-line definition | Domain |
|---|---|---|---|
| **Team** | _équipe_ | A named group of users (e.g. "logistique", "comm", "humains") | [`access-manager`](./domains/access-manager.md) |
| **Permission** | _permission_ | A named capability assigned to a team (e.g. `WRITE_FA`, `MANAGE_PERMISSIONS`) | [`access-manager`](./domains/access-manager.md) |
| **Role** | _rôle_ | A team membership conveying permissions transitively | [`access-manager`](./domains/access-manager.md) |

## See also

- [`docs/03-business/`](./README.md) — domain pages
- [`docs/02-architecture/dependency-hierarchy.md`](../02-architecture/dependency-hierarchy.md) — how domains relate

---

_Last reviewed: 2026-05 — DRAFT_
