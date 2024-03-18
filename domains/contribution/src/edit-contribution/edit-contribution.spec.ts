import { describe, it, expect } from "vitest";
import { EditContribution } from "./edit-contribution";
import { InMemoryEditContributions } from "./edit-contribution.inmemory";
import { Contribution } from "../contribution";
import { InsufficientAmount } from "../contribution.error";

const VALID_AMOUNT = 500;
const INVALID_AMOUNT = 90;
const CURRENT_EDITION = 49;

const noel: Contribution = {
  adherentId: 1,
  amount: 100,
  edition: CURRENT_EDITION,
  paymentDate: new Date(2024, 9, 10),
  expirationDate: new Date(2025, 9, 10),
};

const lea: Contribution = {
  adherentId: 2,
  amount: 150,
  edition: CURRENT_EDITION - 1,
  paymentDate: new Date(2023, 9, 10),
  expirationDate: new Date(2024, 9, 10),
};

describe("Edit contribution", () => {
  describe("when editing amount of an existing contribution", () => {
    const contributions = new InMemoryEditContributions([noel]);
    const edit = new EditContribution(contributions);
    describe("when new amount is at least than 100 cents", async () => {
      const contribution = await edit.amount(
        noel.adherentId,
        noel.edition,
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
            await edit.amount(noel.adherentId, noel.edition, INVALID_AMOUNT),
        ).rejects.toThrow(InsufficientAmount);
      });
    });
  });

  describe("when editing amount of a non-existing contribution", () => {
    const contributions = new InMemoryEditContributions();
    const edit = new EditContribution(contributions);
    it("should indicate that the contribution does not exist", async () => {
      expect(
        async () => await edit.amount(200, CURRENT_EDITION, VALID_AMOUNT),
      ).rejects.toThrow();
    });
  });

  describe("when looking for current contributions", () => {
    const contributions = new InMemoryEditContributions([noel, lea]);
    const edit = new EditContribution(contributions);
    it("should return current contributions", async () => {
      const contributions =
        await edit.findCurrentContributions(CURRENT_EDITION);

      expect(contributions).toMatchObject([noel]);
    });
  });

  describe("when removing a contribution", () => {
    const contributions = new InMemoryEditContributions([noel, lea]);
    const edit = new EditContribution(contributions);
    it("should remove the contribution", async () => {
      await edit.remove(noel.adherentId, noel.edition);

      expect(contributions).not.toContain(noel);
    });
  });
});
