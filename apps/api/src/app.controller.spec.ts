import { beforeEach, describe, expect, it, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MailService } from "./mail/mail.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: MailService, useValue: { mailTest: vi.fn() } },
      ],
    }).compile();
    appController = new AppController(
      app.get(AppService),
      app.get(MailService),
    );
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toContain(
        "Hello from overbookd backend",
      );
    });
  });
});
