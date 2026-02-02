import { vi } from "vitest";

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
  },
}));
