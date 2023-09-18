import { beforeEach, describe, expect, it } from "vitest";
import { PayContribution } from "./pay-contribution";
import { InMemoryContributionRepository } from "./contribution-repository.inmemory";
import { Contribution } from "./contribution.model";
import {
  HAS_ALREADY_PAYED_ERROR_MESSAGE,
  INSUFFICIENT_AMOUNT_ERROR_MESSAGE,
} from "./pay-contribution.error";

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

  describe("when user has not already payed his contribution", () => {

    it("should have expiration date after payment date", async () => {
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
  
    it("should have an amount equal than one hundred cents", async () => {
      const contributionForm = { userId: 1, amount: 100 };
      const payedContribution = await payContribution.apply(contributionForm);
  
      expect(payedContribution.amount).toBeEqual(100);
    })

    it("should have an amount greater than one hundred cents", async () => {
      const contributionForm = { userId: 1, amount: 150 };
      const payedContribution = await payContribution.apply(contributionForm);
  
      expect(payedContribution.amount).toBeEqual(150);
    })

    it("should have an amount less than one hundred cents", async () => {
      const contributionForm = { userId: 1, amount: 90 };
      const payedContribution = await payContribution.apply(contributionForm);

      expect(payedContribution).toThrow(INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
    });
  });

  describe("when user has already payed his contribution", () => {
    const contribution = { userId: 2, amount: 150 };

    it("should indicate that user has already payed", async () => {
      const payedContribution = await payContribution.apply(contribution);

      expect(payedContribution).toThrow(HAS_ALREADY_PAYED_ERROR_MESSAGE);
    });
  });
});
