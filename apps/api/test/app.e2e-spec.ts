import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppTestModule } from "./app-test.module";
import { describe, beforeEach, it, expect } from "vitest";
import { MailService } from "../src/mail/mail.service";
import { AppService } from "../src/app.service";
import { DomainEventService } from "../src/domain-event/domain-event.service";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppTestModule],
    })
      .overrideProvider(MailService)
      .useValue({ onApplicationBootstrap: () => {}, })
      .overrideProvider(DomainEventService)
      .useValue({ staffsRegistered: { subscribe: () => {} }, })
      .overrideProvider(AppService)
      .useValue({ getHello: () => "Hello from overbookd backend", })
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
