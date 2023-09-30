import { describe, it, expect, beforeAll } from "vitest";
import { Adherents } from "./adherents";
import { PersonnalAccountAlerting } from "./personnal-account-alerting";
import { InMemoryAdhrents } from "./adherents.in-memory";
import { NEGATIVE_BALANCE } from "./in-debt";
import { CURRENT_BALANCE_MESSAGE } from "./current-balance";

const adherentWithCredit = { id: 1, balance: 13 };
const adherentWithEmptyAccount = { id: 2, balance: 0 };
const adherentInDebts = { id: 3, balance: -7 };

describe("In Debt Alerting", () => {
  let adherents: Adherents;
  let personnalAccountAlert: PersonnalAccountAlerting;
  beforeAll(() => {
    adherents = new InMemoryAdhrents([
      adherentWithCredit,
      adherentWithEmptyAccount,
      adherentInDebts,
    ]);
    personnalAccountAlert = new PersonnalAccountAlerting(adherents);
  });
  describe("when adherent has positive balance", () => {
    it("should generate current balance alert", async () => {
      const alert = await personnalAccountAlert.for(adherentWithCredit.id);
      expect(alert).not.toBe(undefined);
    });
    it("should indicate adherent has positive balance", async () => {
      const alert = await personnalAccountAlert.for(adherentWithCredit.id);
      expect(alert?.summary).toBe(CURRENT_BALANCE_MESSAGE);
    });
    it("should indicate adherent balance", async () => {
      const alert = await personnalAccountAlert.for(adherentWithCredit.id);
      expect(alert?.balance).toBe(adherentWithCredit.balance);
    });
  });
  describe("when adherent has balance to 0", () => {
    it("shouldn't generate alert", async () => {
      const alert = await personnalAccountAlert.for(
        adherentWithEmptyAccount.id,
      );
      expect(alert).toBe(undefined);
    });
  });
  describe("when adherent has negative balance", () => {
    it("should generate in debt alert", async () => {
      const alert = await personnalAccountAlert.for(adherentInDebts.id);
      expect(alert).not.toBe(undefined);
    });
    it("should indicate adherent is in debt", async () => {
      const alert = await personnalAccountAlert.for(adherentInDebts.id);
      expect(alert?.summary).toBe(NEGATIVE_BALANCE);
    });
    it("should indicate adherent balance", async () => {
      const alert = await personnalAccountAlert.for(adherentInDebts.id);
      expect(alert?.balance).toBe(adherentInDebts.balance);
    });
  });
});
