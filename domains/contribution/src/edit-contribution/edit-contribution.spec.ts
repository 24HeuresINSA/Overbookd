import { describe, it, expect } from "vitest";
import {
  AdherentWithContribution,
  EditContribution,
} from "./edit-contribution.js";
import { InMemoryEditContributions } from "./edit-contribution.inmemory.js";
import { Adherent, Contribution, DONATOR, MEMBER } from "../contribution.js";
import { InMemoryAdherents } from "./adherents.inmemory.js";
import { NotFoundContribution } from "./edit-contribution.error.js";

const CURRENT_EDITION = 49;

const noel: Adherent = {
  id: 1,
  firstName: "Noël",
  lastName: "Ertsemud",
  email: "noel.ertsemud@example.com",
  teams: [],
};
const lea: Adherent = {
  id: 2,
  firstName: "Léa",
  lastName: "Mauyno",
  nickname: "Shogosse",
  email: "lea.mauyno@example.com",
  teams: [],
};

const noelContrib: Contribution = {
  adherentId: 1,
  type: MEMBER,
  edition: CURRENT_EDITION,
  paymentDate: new Date(2024, 9, 10),
  expirationDate: new Date(2025, 9, 10),
};

const leaContrib: Contribution = {
  adherentId: 2,
  type: DONATOR,
  edition: CURRENT_EDITION - 1,
  paymentDate: new Date(2023, 9, 10),
  expirationDate: new Date(2024, 9, 10),
};

describe("Edit contribution", () => {
  describe("when editing type of an existing contribution", async () => {
    const contributions = new InMemoryEditContributions([noelContrib]);
    const adherents = new InMemoryAdherents([noel, lea]);
    const edit = new EditContribution(contributions, adherents);
    const contribution = await edit.type(
      noelContrib.adherentId,
      noelContrib.edition,
      DONATOR,
    );
    it("should update the type", () => {
      expect(contribution.type).toBe(DONATOR);
    });
    it("should save the contribution", () => {
      expect(contributions.all).toContain(contribution);
    });
  });

  describe("when editing type of a non-existing contribution", () => {
    const contributions = new InMemoryEditContributions();
    const adherents = new InMemoryAdherents([noel, lea]);
    const edit = new EditContribution(contributions, adherents);
    it("should indicate that the contribution does not exist", async () => {
      await expect(
        async () => await edit.type(200, CURRENT_EDITION, DONATOR),
      ).rejects.toThrow(NotFoundContribution);
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
        type: noelContrib.type,
        paymentDate: noelContrib.paymentDate,
        edition: noelContrib.edition,
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
