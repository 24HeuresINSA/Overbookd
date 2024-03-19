import { describe, it, expect } from "vitest";
import {
  AdherentWithContribution,
  EditContribution,
} from "./edit-contribution";
import { InMemoryEditContributions } from "./edit-contribution.inmemory";
import { Adherent, Contribution } from "../contribution";
import { InsufficientAmount } from "../contribution.error";
import { InMemoryAdherents } from "./adherents.inmemory";

const VALID_AMOUNT = 500;
const INVALID_AMOUNT = 90;
const CURRENT_EDITION = 49;

const noel: Adherent = {
  id: 1,
  firstname: "Noël",
  lastname: "Ertsemud",
};
const lea: Adherent = {
  id: 2,
  firstname: "Léa",
  lastname: "Mauyno",
  nickname: "Shogosse",
};

const noelContrib: Contribution = {
  adherentId: 1,
  amount: 100,
  edition: CURRENT_EDITION,
  paymentDate: new Date(2024, 9, 10),
  expirationDate: new Date(2025, 9, 10),
};

const leaContrib: Contribution = {
  adherentId: 2,
  amount: 150,
  edition: CURRENT_EDITION - 1,
  paymentDate: new Date(2023, 9, 10),
  expirationDate: new Date(2024, 9, 10),
};

describe("Edit contribution", () => {
  describe("when editing amount of an existing contribution", () => {
    const contributions = new InMemoryEditContributions([noelContrib]);
    const adherents = new InMemoryAdherents([noel, lea]);
    const edit = new EditContribution(contributions, adherents);
    describe("when new amount is at least than 100 cents", async () => {
      const contribution = await edit.amount(
        noelContrib.adherentId,
        noelContrib.edition,
        VALID_AMOUNT,
      );
      it("should update the amount", async () => {
        expect(contribution.amount).toBe(VALID_AMOUNT);
      });
      it("should save the contribution", async () => {
        expect(contributions.all).toContain(contribution);
      });
    });
    describe("when new amount is less than 100 cents", () => {
      it("should indicate that the minimum amount is 100 cents", async () => {
        expect(
          async () =>
            await edit.amount(
              noelContrib.adherentId,
              noelContrib.edition,
              INVALID_AMOUNT,
            ),
        ).rejects.toThrow(InsufficientAmount);
      });
    });
  });

  describe("when editing amount of a non-existing contribution", () => {
    const contributions = new InMemoryEditContributions();
    const adherents = new InMemoryAdherents([noel, lea]);
    const edit = new EditContribution(contributions, adherents);
    it("should indicate that the contribution does not exist", async () => {
      expect(
        async () => await edit.amount(200, CURRENT_EDITION, VALID_AMOUNT),
      ).rejects.toThrow();
    });
  });

  describe("when looking for adherents with valid contribution", () => {
    const contributions = new InMemoryEditContributions([
      noelContrib,
      leaContrib,
    ]);
    const adherents = new InMemoryAdherents([noel, lea]);
    const edit = new EditContribution(contributions, adherents);
    it("should return adherents with valid contribution", async () => {
      const contributions =
        await edit.findAdherentsWithValidContribution(CURRENT_EDITION);

      const expectedNoel: AdherentWithContribution = {
        ...noel,
        amount: noelContrib.amount,
      };
      expect(contributions).toMatchObject([expectedNoel]);
    });
  });

  describe("when removing a contribution", () => {
    const contributions = new InMemoryEditContributions([
      noelContrib,
      leaContrib,
    ]);
    const adherents = new InMemoryAdherents([noel, lea]);
    const edit = new EditContribution(contributions, adherents);
    it("should remove the contribution", async () => {
      await edit.remove(noelContrib.adherentId, noelContrib.edition);

      expect(contributions).not.toContain(noelContrib);
    });
  });
});
