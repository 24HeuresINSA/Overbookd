import { vi } from "vitest";

vi.mock("../src/mail/mail.service", () => {
  class MailService {
    onApplicationBootstrap() {}
  }
  return { MailService };
});

vi.mock("../src/domain-event/domain-event.service", () => {
  class DomainEventService {
    staffsRegistered = { subscribe() {} };
    volunteersRegistered = { subscribe() {} };
    volunteersEnrolled = { subscribe() {} };
    festivalActivityRejected = { subscribe() {} };
    festivalTaskRejected = { subscribe() {} };
    festivalActivityApproved = { subscribe() {} };
    closedSharedMeal = { subscribe() {} };
  }
  return { DomainEventService };
});
