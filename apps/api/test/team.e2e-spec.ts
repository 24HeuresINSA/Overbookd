import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { Team } from "../src/team/team.model";

const TEAMS: Team[] = [
  {
    name: "Mega admin",
    code: "super-admin",
    color: "#ffb703",
    icon: "mdi-flash",
  },
  {
    name: "Test team",
    code: "test",
    color: "#737F49",
    icon: "mdi-forklift",
  },
];

describe("Teams (e2e)", () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get token and setup globaly
    const res = await request(app.getHttpServer())
      .post("/login")
      .send({ email: "admin@24h.me", password: "password" });

    const { accessToken } = res.body;
    adminToken = accessToken;
  });

  it("/teams (GET)", async () => {
    const res = await request(app.getHttpServer()).get("/teams");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.any(Array));
  });

  it("/teams/fa-validators (GET)", async () => {
    const res = await request(app.getHttpServer())
      .get("/teams/fa-validators")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.any(Array));
  });

  it("/teams/ft-validators (GET)", async () => {
    const res = await request(app.getHttpServer())
      .get("/teams/ft-validators")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.any(Array));
  });

  describe("/teams (post)", () => {
    describe.each`
      code             | data        | expected
      ${"super-admin"} | ${TEAMS[0]} | ${TEAMS[0]}
      ${"test"}        | ${TEAMS[1]} | ${TEAMS[1]}
    `("when #code is creating", ({ code, data, expected }) => {
      it(`sould return the team of ${code}`, async () => {
        const res = await request(app.getHttpServer())
          .post("/teams")
          .set("Authorization", `Bearer ${adminToken}`)
          .send(data);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(expected);
      });
    });
  });
});
