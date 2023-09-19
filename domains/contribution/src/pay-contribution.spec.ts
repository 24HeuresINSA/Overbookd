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
    const contributionForm = { userId: 1, amount: 100 };

    it("should have expiration date after payment date", async () => {
      const payedContribution = await payContribution.for(contributionForm);

      expect(payedContribution.expirationDate.getTime()).toBeGreaterThan(
        payedContribution.paymentDate.getTime(),
      );
    });

    it("should have expiration date on the last day of August", async () => {
      const payedContribution = await payContribution.for(contributionForm);

      expect(payedContribution.expirationDate.getMonth()).toBe(7);
      expect(payedContribution.expirationDate.getDate()).toBe(31);
    });

    describe.each`
      userId | amount | error
      ${1}   | ${100} | ${null}
      ${1}   | ${150} | ${null}
      ${1}   | ${90}  | ${INSUFFICIENT_AMOUNT_ERROR_MESSAGE}
    `("when user try to pay $amount cents", ({ userId, amount, error }) => {
      if (error) {
        it(`should indicate that ${error}`, async () => {
          expect(
            async () => await payContribution.for({ userId, amount }),
          ).rejects.toThrow(INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
        });
      } else {
        it(`should pay ${amount} cents`, async () => {
          const payedContribution = await payContribution.for({
            userId,
            amount,
          });

          expect(payedContribution.amount).toBeGreaterThanOrEqual(amount);
        });
      }
    });
  });

  describe("when user has already payed his contribution", () => {
    const contribution = { userId: 2, amount: 150 };

    it("should indicate that user has already payed", async () => {
      expect(
        async () => await payContribution.for(contribution),
      ).rejects.toThrow(HAS_ALREADY_PAYED_ERROR_MESSAGE);
    });
  });
});
