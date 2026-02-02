import { vi } from "vitest";

vi.mock("../src/authentication/jwt-auth.guard", () => ({
  JwtAuthGuard: class {
    canActivate() {
      return true;
    }
  },
}));

vi.mock("../src/authentication/permissions-auth.guard", () => ({
  PermissionsGuard: class {
    canActivate() {
      return true;
    }
  },
}));

vi.mock("../src/domain-event/domain-event.service", () => ({
  DomainEventService: {
    init: () => ({
      staffsRegistered: { subscribe() {} },
      volunteersRegistered: { subscribe() {} },
      volunteersEnrolled: { subscribe() {} },
      festivalActivityRejected: { subscribe() {} },
      festivalTaskRejected: { subscribe() {} },
      festivalActivityApproved: { subscribe() {} },
      closedSharedMeal: { subscribe() {} },
    }),
  },
}));

vi.mock("../src/mail/mail.service", () => ({
  MailService: class {
    onApplicationBootstrap() {}
    mailTest() {
      return "ok";
    }
  },
}));
