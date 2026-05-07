# Adding a domain

> _What this page covers:_ A recipe for introducing a new bounded context under `domains/`.
> _Who it's for:_ Anyone proposing a new business area in the codebase.

> Pause: do you actually need a new domain? Most of the time you don't. Re-read [`domain-driven-layout.md` → When to add a new domain](../02-architecture/domain-driven-layout.md#when-to-add-a-new-domain) before continuing. UI-only features stay in `apps/web`. Reusable calculations go in `libraries/`. App-specific glue goes in `utils/`.

If you've confirmed you need one, here's the recipe.

## 1. Create the package skeleton

```text
domains/<name>/
├── package.json
├── tsconfig.json
└── src/
    └── index.ts
```

### `package.json`

Use a sibling domain (e.g. `domains/charisma/package.json`) as the template. Replace the name and version. Key fields to keep:

```json
{
  "name": "@overbookd/<name>",
  "version": "0.1.0",
  "type": "module",
  "main": "./src/index.ts",
  "scripts": {
    "lint": "...",
    "format": "...",
    "test:unit": "vitest",
    "test:unit:ci": "vitest --config vitest-ci.config.ts run",
    "version:patch": "...",
    "version:minor": "...",
    "version:major": "..."
  }
}
```

The `version:patch|minor|major` scripts must exist for the release flow to bump this package. Copy them verbatim from a sibling.

### `tsconfig.json`

Extend the workspace root. Copy from a sibling.

## 2. First aggregate and use case

Pick one user-facing scenario. Create a use-case folder.

```text
src/
├── index.ts                # re-export the public API
├── <name>.ts               # aggregate type
├── <name>.factory.ts       # constructors enforcing invariants
├── <name>.fake.ts          # in-memory test double + builder
├── <name>.error.ts         # domain errors
└── <use-case>/
    ├── <use-case>.ts
    └── <use-case>.spec.ts  # mandatory UT
```

The UT must compile and pass before the package is "real". Run it:

```bash
pnpm --filter @overbookd/<name> run test:unit
```

## 3. Define ports for what you need from the world

If your domain needs persistence, declare an interface (a "port"). The implementation lives in `apps/api/src/<slice>/repository/`, not here.

```ts
// src/<name>.port.ts
export const <NAME>S = Symbol("<NAME>S");

export interface <Name>s {
  findById(id: number): Promise<<Name>>;
  save(entity: <Name>): Promise<void>;
}
```

Use cases depend on the port. Tests use the fake. The API supplies the Prisma adapter.

## 4. Wire the API slice

Add `apps/api/src/<name>/`:

```text
apps/api/src/<name>/
├── <name>.module.ts               # NestJS module
├── <name>.controller.ts           # HTTP routes
├── dto/
│   └── *.dto.ts
└── repository/
    └── prisma-<name>.repository.ts
```

Then import the module in `apps/api/src/app.module.ts`:

```ts
@Module({
  imports: [
    /* existing modules */
    <Name>Module,
  ],
})
export class AppModule {}
```

See [`docs/02-architecture/api-anatomy.md`](../02-architecture/api-anatomy.md) for the slice anatomy.

## 5. Add a Prisma model (if needed)

If the domain needs a new table, edit `apps/api/prisma/schema.prisma` and create a migration:

```bash
pnpm db:exec 'prisma migrate dev --name add_<name>'
```

Commit the generated migration folder.

## 6. Document the domain

Replace the placeholder in `docs/03-business/domains/<name>.md` with a real explanation of the domain — purpose, key concepts, lifecycle, where the code lives. Update `docs/03-business/README.md` to include the new domain in the index. Tick the "Updated /docs if relevant" checkbox in your MR.

## 7. Open the MR

A new domain is a noticeable change — keep the MR small if you can. The pattern that works:

1. **MR 1:** package skeleton + first aggregate + first use case + UT (no API, no DB).
2. **MR 2:** API slice + Prisma migration.
3. **MR 3:** Web integration.

Three small MRs are easier to review than one mega-MR.

## See also

- [`docs/02-architecture/domain-driven-layout.md`](../02-architecture/domain-driven-layout.md)
- [`docs/02-architecture/api-anatomy.md`](../02-architecture/api-anatomy.md)
- [`docs/04-conventions/testing.md`](./testing.md)

---

_Last reviewed: 2026-05_
