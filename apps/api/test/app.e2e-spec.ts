import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppTestModule } from "./app-test.module";
import { AppService } from "../src/app.service";
import { beforeEach, describe, expect, it } from "vitest";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppTestModule],
    })
      .overrideProvider(AppService)
      .useValue({ getHello: () => "Hello from overbookd backend" })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", async () => {
    const res = await request(app.getHttpServer()).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Hello from overbookd backend");
  });
});
