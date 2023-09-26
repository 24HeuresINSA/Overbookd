import { describe, it, expect, beforeAll } from "vitest";
import {
  PERSONNAL_ACCOUNT_FINANCING,
  NEGATIVE_BALANCE,
} from "./in-debt-alerting.constant";
import { Adherents, InDebtAlerting } from "./in-debt-alerting";
import { InMemoryAdhrents } from "./adherents.in-memory";

const adherentWithCredit = { id: 1, balance: 13 };
const adherentWithEmptyAccount = { id: 2, balance: 0 };
const adherentInDebts = { id: 3, balance: -7 };

describe("In Debt Alerting", () => {
  let adherents: Adherents;
  let inDebtAlert: InDebtAlerting;
  beforeAll(() => {
    adherents = new InMemoryAdhrents([
      adherentWithCredit,
      adherentWithEmptyAccount,
      adherentInDebts,
    ]);
    inDebtAlert = new InDebtAlerting(adherents);
  });
  describe("when adherent has positive balance", () => {
    it("shouldn't generate alert", async () => {
      const alert = await inDebtAlert.for(adherentWithCredit.id);
      expect(alert).toBe(undefined);
    });
  });
  describe("when adherent has balance to 0", () => {
    it("shouldn't generate alert", async () => {
      const alert = await inDebtAlert.for(adherentWithEmptyAccount.id);
      expect(alert).toBe(undefined);
    });
  });
  describe("when adherent has negative balance", () => {
    it("shouldn't generate alert", async () => {
      const alert = await inDebtAlert.for(adherentInDebts.id);
      expect(alert).not.toBe(undefined);
    });
    it("should indicate adherent is in debt", async () => {
      const alert = await inDebtAlert.for(adherentInDebts.id);
      expect(alert?.message).toBe(NEGATIVE_BALANCE);
    });
    it("should indicate adherent balance", async () => {
      const alert = await inDebtAlert.for(adherentInDebts.id);
      expect(alert?.description).toContain(adherentInDebts.balance);
    });
    it("should instruct adherent to pay it debts", async () => {
      const alert = await inDebtAlert.for(adherentInDebts.id);
      expect(alert?.description).toContain(PERSONNAL_ACCOUNT_FINANCING);
    });
  });
});
