import { beforeEach, describe, expect, it } from "vitest";
import { Member, PayContribution } from "./pay-contribution";
import { EXPIRATION_DATE } from "./contribute";
import { InMemoryContributionRepository } from "./contribution-repository.inmemory";
import { Contribution } from "./contribute";
import {
  HAS_ALREADY_PAYED_ERROR_MESSAGE,
  INSUFFICIENT_AMOUNT_ERROR_MESSAGE,
  NOT_ALLOWED_TO_PAY_CONTRIBUTION_ERROR_MESSAGE,
} from "./pay-contribution.error";
import { ONE_YEAR_IN_MS } from "@overbookd/period";
import { PAY_CONTRIBUTION } from "@overbookd/permission";

const lea: Member = {
  id: 1,
  firstname: "Léa",
  lastname: "Mauyno",
  nickname: "Shogosse",
  permissions: [PAY_CONTRIBUTION],
};
const noel: Member = {
  id: 2,
  firstname: "Noël",
  lastname: "Ertsemud",
  permissions: [PAY_CONTRIBUTION],
};
const tatouin: Member = {
  id: 3,
  firstname: "Tatouin",
  lastname: "Jesoph",
  permissions: [],
};
const adherents: Member[] = [lea, noel, tatouin];

const contributions: Contribution[] = [
  {
    adherentId: lea.id,
    amount: 100,
    edition: 48,
    paymentDate: new Date(2022, 8, 1),
    expirationDate: new Date(2023, 7, 31),
  },
  {
    adherentId: noel.id,
    amount: 200,
    edition: 48,
    paymentDate: new Date(2022, 10, 20),
    expirationDate: new Date(2023, 7, 31),
  },
  {
    adherentId: noel.id,
    amount: 100,
    edition: 49,
    paymentDate: new Date(2023, 9, 12),
    expirationDate: new Date(2024, 7, 31),
  },
];

describe("Pay contribution", () => {
  let payContribution: PayContribution;
  let contributionRepository: InMemoryContributionRepository;

  describe("when adherent is paying his contribution", () => {
    beforeEach(() => {
      contributionRepository = new InMemoryContributionRepository(
        contributions,
        adherents,
      );
      payContribution = new PayContribution(contributionRepository);
    });

    describe("when adherent has not already payed his contribution", () => {
      describe("when adherent try to pay less than 100 cents", () => {
        it("should indicate that the minimum amount is 100 cents", async () => {
          const contributionForm = { adherentId: lea.id, amount: 90 };
          expect(
            async () => await payContribution.for(contributionForm),
          ).rejects.toThrow(INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
        });
      });

      describe("when non adherent try to pay a contribution", () => {
        it("should indicate that non adherent is not allowed to pay contribution", async () => {
          const contributionForm = { adherentId: tatouin.id, amount: 100 };
          expect(
            async () => await payContribution.for(contributionForm),
          ).rejects.toThrow(NOT_ALLOWED_TO_PAY_CONTRIBUTION_ERROR_MESSAGE);
        });
      });

      describe.each`
        adherentId | amount
        ${lea.id}  | ${100}
        ${lea.id}  | ${150}
      `(
        "when adherent #$adherentId try to pay $amount cents",
        ({ adherentId, amount }) => {
          const contributionForm = { adherentId, amount };

          it(`should pay ${amount} cents`, async () => {
            const payedContribution =
              await payContribution.for(contributionForm);

            expect(payedContribution.amount).toBeGreaterThanOrEqual(amount);
          });

          it("should have expiration date after payment date", async () => {
            const payedContribution =
              await payContribution.for(contributionForm);

            expect(payedContribution.expirationDate.getTime()).toBeGreaterThan(
              payedContribution.paymentDate.getTime(),
            );
          });

          it("should have expiration date before next edition", async () => {
            const payedContribution =
              await payContribution.for(contributionForm);

            const duration =
              payedContribution.expirationDate.getTime() -
              payedContribution.paymentDate.getTime();

            expect(duration).toBeLessThanOrEqual(ONE_YEAR_IN_MS);
          });

          it("should have expiration date on the last day of August", async () => {
            const payedContribution =
              await payContribution.for(contributionForm);
            const { month, day } = EXPIRATION_DATE;

            expect(payedContribution.expirationDate.getMonth()).toBe(month);
            expect(payedContribution.expirationDate.getDate()).toBe(day);
          });

          it("should save it as a new contribution", async () => {
            const payedContribution =
              await payContribution.for(contributionForm);

            expect(contributionRepository.has(payedContribution)).toBe(true);
          });
        },
      );
    });

    describe("when adherent has already payed his contribution", () => {
      const contribution = { adherentId: noel.id, amount: 150 };

      it("should indicate that adherent has already payed", async () => {
        expect(
          async () => await payContribution.for(contribution),
        ).rejects.toThrow(HAS_ALREADY_PAYED_ERROR_MESSAGE);
      });
    });
  });

  describe("when manager is looking for adherents with contribution out-to-date", () => {
    beforeEach(() => {
      contributionRepository = new InMemoryContributionRepository(
        contributions,
        adherents,
      );
      payContribution = new PayContribution(contributionRepository);
    });

    it("should return adherents with contribution out-to-date", async () => {
      const adherents =
        await payContribution.findAdherentsWithContributionOutToDate();
      const { permissions, ...leaPersonalData } = lea;

      expect(adherents).toMatchObject([leaPersonalData]);
    });
  });
});
