import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { TeamTestModule } from "./team-test.module";
import { TeamService } from "../src/team/team.service";
import { beforeAll, describe, expect, it } from "vitest";

describe("Teams (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TeamTestModule],
    })
      .overrideProvider(TeamService)
      .useValue({
        findAll: () => [],
        create: (team) => team,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/teams (GET)", async () => {
    const res = await request(app.getHttpServer()).get("/teams");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("/teams (POST)", async () => {
    const team = { name: "Test", code: "test", color: "#fff", icon: "mdi" };
    const res = await request(app.getHttpServer())
      .post("/teams")
      .send(team);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(team);
  });
});
