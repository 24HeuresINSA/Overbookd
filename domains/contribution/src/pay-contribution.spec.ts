import { beforeEach, describe, expect, it } from "vitest";
import { PayContribution } from "./pay-contribution";
import { InMemoryContributionRepository } from "./contribution-repository.inmemory";
import { Contribution } from "./contribution.model";

const contributions: Contribution[] = [
  {
    userId: 1,
    amount: 100,
    edition: 48,
    paymentDate: new Date(2022, 8, 1),
    expirationDate: new Date(2023, 7, 31),
  },
  {
    userId: 2,
    amount: 200,
    edition: 48,
    paymentDate: new Date(2022, 10, 20),
    expirationDate: new Date(2023, 7, 31),
  },
  {
    userId: 2,
    amount: 100,
    edition: 49,
    paymentDate: new Date(2023, 9, 12),
    expirationDate: new Date(2024, 7, 31),
  },
];

describe("Pay contribution", () => {
  let payContribution: PayContribution;
  let contributionRepository: InMemoryContributionRepository;

  beforeEach(() => {
    contributionRepository = new InMemoryContributionRepository(contributions);
    payContribution = new PayContribution(contributionRepository);
  });

  /*it("should have expiration date after payment date", async () => {
    const contributionForm = { userId: 1, amount: 100 };
    const payedContribution = await payContribution.apply(contributionForm);

    expect(payedContribution.expirationDate.getTime()).toBeGreaterThan(
      payedContribution.paymentDate.getTime(),
    );
  });

  it("should have expiration date on the last day of August", async () => {
    const contributionForm = { userId: 1, amount: 100 };
    const payedContribution = await payContribution.apply(contributionForm);

    expect(payedContribution.expirationDate.getMonth()).toBe(7);
    expect(payedContribution.expirationDate.getDate()).toBe(31);
  });

  it("should have an amount greater or equal than one hundred cents", async () => {
    const contributionForm = { userId: 1, amount: 100 };
    const payedContribution = await payContribution.apply(contributionForm);

    expect(payedContribution.amount).toBeGreaterThanOrEqual(100);
  });*/
});
