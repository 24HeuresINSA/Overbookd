# Adding an API endpoint

> _What this page covers:_ A recipe for adding a new HTTP endpoint in `apps/api` — module, controller, DTO, use case, e2e test.
> _Who it's for:_ Anyone exposing a new piece of domain logic over HTTP.

For the why and the wider anatomy, read [`docs/architecture/api-anatomy.md`](../architecture/api-anatomy.md) first.

## The shape

The endpoint must:

1. Live in a slice (existing or new) under `apps/api/src/<slice>/`.
2. Have a controller method with route + auth decorators.
3. Validate input via a DTO.
4. Call a domain use case (no business logic in the controller).
5. Be covered by an e2e test in `apps/api/test/`.
6. Be documented for Swagger via `@ApiTags`, `@ApiOperation`, `@ApiResponse`.

## 1. Pick or create the slice

If you're extending an existing controller (most cases), open `apps/api/src/<slice>/<slice>.controller.ts`.

If you need a new slice, follow the [adding-a-domain](./adding-a-domain.md) recipe — creating an API slice without a backing domain is almost always a smell.

## 2. Add the DTO

```ts
// apps/api/src/<slice>/dto/<verb>-<noun>.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateFestivalActivityDto {
  @ApiProperty({ description: "Activity name" })
  @IsString()
  @MinLength(3)
  name: string;
}
```

DTOs are flat, serializable, and decorated for both validation (`class-validator`) and OpenAPI (`@nestjs/swagger`).

## 3. Add the controller method

```ts
@Post()
@Permission(WRITE_FA)
@ApiBody({ type: CreateFestivalActivityDto })
@ApiResponse({ status: 201, type: FestivalActivityResponseDto })
async create(
  @Body() dto: CreateFestivalActivityDto,
  @Request() req: AuthenticatedRequest,
): Promise<FestivalActivityResponseDto> {
  const fa = await this.activities.create({
    name: dto.name,
    instigator: req.user,
  });
  return mapToResponseDto(fa);
}
```

Things to notice:

- `@Permission(...)` references a constant from `@overbookd/permission`, not a string literal.
- The controller calls a domain use case via the injected port (`this.activities`), it does **not** import a Prisma client.
- The return type is a DTO, not the domain type. Map at the boundary.

## 4. Wire it in the module

In `<slice>.module.ts`, make sure the use case (or the port-and-adapter pair) is provided. Often nothing changes — you're calling an existing port.

If you're introducing a new port:

```ts
@Module({
  imports: [PrismaModule],
  controllers: [FestivalActivityController],
  providers: [
    PrismaService,
    {
      provide: FESTIVAL_ACTIVITIES,
      useFactory: (prisma) => new PrismaFestivalActivities(prisma),
      inject: [PrismaService],
    },
  ],
})
export class FestivalEventModule {}
```

## 5. Add the use case in the domain

If you're calling new domain behavior, that behavior lives in `domains/<name>/src/`, not in the API.

Follow the existing pattern: a use-case folder with `<use-case>.ts` and `<use-case>.spec.ts`.

```ts
// domains/festival-event/src/festival-activity/creation/creation.ts
export class CreateFestivalActivity {
  constructor(private readonly activities: FestivalActivities) {}

  async create(input: CreateInput): Promise<FestivalActivity> {
    const fa = FestivalActivityFactory.draftFor(input);
    await this.activities.save(fa);
    return fa;
  }
}
```

Write the UT before (or alongside) the implementation — see [`testing.md`](./testing.md).

## 6. Add the e2e test

```ts
// apps/api/test/festival-activity-creation.e2e-spec.ts
describe("POST /festival-activities", () => {
  let app: INestApplication;
  beforeAll(async () => { /* boot Nest with test DB */ });
  afterAll(async () => { await app.close(); });

  it("creates a draft for an authenticated instigator", async () => {
    const token = await loginAs(app, "noel");
    const res = await request(app.getHttpServer())
      .post("/festival-activities")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Crêpes party" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("DRAFT");
  });

  it("rejects a payload without name", async () => {
    /* ... */
    expect(res.status).toBe(400);
  });

  it("rejects an unauthenticated caller", async () => {
    /* ... */
    expect(res.status).toBe(401);
  });
});
```

Test at minimum: the happy path, one validation failure, and the auth gate.

## 7. Verify locally

```bash
pnpm --filter @overbookd/<domain> run test:unit          # domain UTs pass
pnpm --filter @overbookd/api run test:e2e                # e2e passes
pnpm dev:start                                            # boot the stack
# hit the endpoint via https://overbookd.traefik.me/api/swagger
```

## Common mistakes

| Smell | Fix |
|---|---|
| `if`/`switch` on business state in the controller | Push it into the domain |
| Catching domain errors in the controller | Let `http-exception.filter.ts` map them globally |
| Returning the domain type directly | Map to a response DTO at the boundary |
| Calling Prisma from the use case | Define a port; have the API supply the adapter |
| Permission strings instead of constants | Use the constant from `@overbookd/permission` |
| No `@ApiResponse` decorator | Swagger UI will be useless to the front-end team |

## See also

- [`docs/architecture/api-anatomy.md`](../architecture/api-anatomy.md)
- [`docs/architecture/data-model.md`](../architecture/data-model.md)
- [`docs/conventions/adding-a-domain.md`](./adding-a-domain.md)

---

_Last reviewed: 2026-05_
