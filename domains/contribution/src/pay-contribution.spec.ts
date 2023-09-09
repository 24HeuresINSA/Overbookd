import { describe, expect, it } from "vitest";
import { PayContribution } from "./pay-contribution";

describe("Pay contribution", () => {
  const contributionForm = { userId: 1, amount: 100 };

  it("should have expiration date after payment date", () => {
    const payedContribution = PayContribution.of(contributionForm);

    expect(payedContribution.expirationDate.getTime()).toBeGreaterThan(
      payedContribution.paymentDate.getTime(),
    );
  });

  it("should have expiration date on the last day of August", () => {
    const payedContribution = PayContribution.of(contributionForm);

    expect(payedContribution.expirationDate.getMonth()).toBe(7);
    expect(payedContribution.expirationDate.getDate()).toBe(31);
  });

  it("should have an amount greater or equal than one hundred cents", () => {
    const payedContribution = PayContribution.of(contributionForm);

    expect(payedContribution.amount).toBeGreaterThanOrEqual(100);
  });
});
