import { beforeEach, describe, it, expect } from "vitest";
import { EXTERNAL_EVENT, TransactionUser } from "../transaction";
import { InMemoryExternalEventTransactions } from "./external-event-transactions.inmemory";
import { CreateExternalEventTransactions } from "./create-external-event-transactions";
import {
  AtLeastOneInsufficientAmount,
  InsufficientAmount,
} from "./external-event.error";

const olop: TransactionUser = {
  id: 1,
  firstname: "Olop",
  lastname: "Hcsnumeid",
};
const cul: TransactionUser = {
  id: 2,
  firstname: "Cul",
  lastname: "Nehgahrednav",
};

describe("External event transactions", () => {
  let externalEvents: InMemoryExternalEventTransactions;
  let externalEvent: CreateExternalEventTransactions;

  beforeEach(() => {
    externalEvents = new InMemoryExternalEventTransactions([olop, cul], []);
    externalEvent = new CreateExternalEventTransactions(externalEvents);
  });

  describe("when adding an adherent's consumption to an external event", () => {
    const newEventConsumption = {
      amount: 10,
      consumer: olop.id,
      context: "Gala",
    };

    it("should create an external event transaction", async () => {
      const newTransaction = await externalEvent.apply(newEventConsumption);
      expect(newTransaction.type).toBe(EXTERNAL_EVENT);
    });
    it("should create an external event transaction with the right amount", async () => {
      const { amount } = await externalEvent.apply(newEventConsumption);
      expect(amount).toBe(newEventConsumption.amount);
    });
    it("should create an external event transaction with the right payor", async () => {
      const { from } = await externalEvent.apply(newEventConsumption);
      expect(from).toBe(olop);
    });
    it("should create an external event transaction with the right context", async () => {
      const { context } = await externalEvent.apply(newEventConsumption);
      expect(context).toBe("Gala");
    });
    it("should create an external event transaction with a date", async () => {
      const { date } = await externalEvent.apply(newEventConsumption);
      expect(date).toBeInstanceOf(Date);
    });
    it("should add external event transaction to the list of external event transactions", async () => {
      const newEventTransaction =
        await externalEvent.apply(newEventConsumption);
      expect(externalEvents.all).toEqual([newEventTransaction]);
    });

    describe("when adding another external event consumption from another adherent", async () => {
      const otherEventConsumption = {
        amount: 20,
        consumer: cul.id,
        context: "KIFF KFET",
      };
      it("should add external event transaction to the list of external event transactions", async () => {
        const newEventTransaction =
          await externalEvent.apply(newEventConsumption);
        const otherEventTransaction = await externalEvent.apply(
          otherEventConsumption,
        );

        expect(externalEvents.all).toEqual([
          newEventTransaction,
          otherEventTransaction,
        ]);
      });
    });
  });

  describe("when adding an adherent's consumption to an external event with negative amount", () => {
    it("should indicate that amount cannot be negative", () => {
      const negativeConsumptionForm = {
        amount: -10,
        consumer: olop.id,
        context: "Gala",
      };
      const applyConsumption = () =>
        externalEvent.apply(negativeConsumptionForm);

      expect(applyConsumption).rejects.toThrow(InsufficientAmount);
    });
  });
  describe("when adding an adherent's consumption to an external event with null amount", () => {
    it("should indicate that amount cannot be negative", () => {
      const nullConsumptionForm = {
        amount: 0,
        consumer: olop.id,
        context: "Gala",
      };
      const applyConsumption = () => externalEvent.apply(nullConsumptionForm);

      expect(applyConsumption).rejects.toThrow(InsufficientAmount);
    });
  });

  describe("when adding multiple external event consumptions from adherents", () => {
    const consumptionForms = [
      { amount: 100, consumer: olop.id, context: "Gala" },
      { amount: 200, consumer: cul.id, context: "KIFF KFET" },
    ];

    it("should create multiple external event transactions", async () => {
      const newEventTransactions =
        await externalEvent.applyMultiple(consumptionForms);
      expect(newEventTransactions).toHaveLength(2);
    });
    it("should create right external event transactions", async () => {
      const newEventTransactions =
        await externalEvent.applyMultiple(consumptionForms);
      const baseTransaction = { type: EXTERNAL_EVENT, date: expect.any(Date) };
      const expected = [
        { ...baseTransaction, amount: 100, from: olop, context: "Gala" },
        { ...baseTransaction, amount: 200, from: cul, context: "KIFF KFET" },
      ];
      expect(newEventTransactions).toEqual(expected);
    });
    it("should add external event transactions to the list of external event transactions", async () => {
      await externalEvent.applyMultiple(consumptionForms);
      expect(externalEvents.all).toHaveLength(2);
    });
  });

  describe("when adding multiple external event consumptions with at least one negative or null amount", () => {
    const consumptionForms = [
      { amount: 100, consumer: olop.id, context: "Gala" },
      { amount: -200, consumer: cul.id, context: "Gala" },
    ];
    it("should indicate that amount cannot be negative or null", () => {
      const applyMultipleConsumptions = () =>
        externalEvent.applyMultiple(consumptionForms);
      expect(applyMultipleConsumptions).rejects.toThrow(
        AtLeastOneInsufficientAmount,
      );
    });
  });
});
