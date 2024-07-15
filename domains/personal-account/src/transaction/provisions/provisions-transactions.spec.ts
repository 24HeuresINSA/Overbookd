import { beforeEach, describe, it, expect } from "vitest";
import { PROVISIONS, TransactionUser } from "../transaction";
import { InMemoryProvisionsTransactions } from "./provisions-transactions.inmemory";
import { CreateProvisionsTransactions } from "./create-provisions-transactions";
import {
  AtLeastOneInsufficientConsumption,
  NoConsumer,
} from "../transaction.error";
import { InsufficientStickPrice } from "./provisions.error";

const drapsag: TransactionUser = {
  id: 1,
  firstname: "Drapsag",
  lastname: "Lehcim",
};
const lea: TransactionUser = {
  id: 2,
  firstname: "Lea",
  lastname: "Mouyno",
};
const cul: TransactionUser = {
  id: 3,
  firstname: "Cul",
  lastname: "Nehgahrednav",
};

const twoConsumers = [
  { consumer: drapsag.id, consumption: 4 },
  { consumer: lea.id, consumption: 1 },
];
const expectedTransactionsForTwoConsumers = [
  {
    amount: 240,
    date: expect.any(Date),
    type: PROVISIONS,
    context: "Conso placard: 4 bâtons",
    from: drapsag,
  },
  {
    amount: 60,
    date: expect.any(Date),
    type: PROVISIONS,
    context: "Conso placard: 1 bâton",
    from: lea,
  },
];

const threeConsumers = [
  { consumer: drapsag.id, consumption: 1 },
  { consumer: lea.id, consumption: 3 },
  { consumer: cul.id, consumption: 11 },
];
const expectedTransactionsForThreeConsumers = [
  {
    amount: 60,
    date: expect.any(Date),
    type: PROVISIONS,
    context: "Conso placard: 1 bâton",
    from: drapsag,
  },
  {
    amount: 180,
    date: expect.any(Date),
    type: PROVISIONS,
    context: "Conso placard: 3 bâtons",
    from: lea,
  },
  {
    amount: 660,
    date: expect.any(Date),
    type: PROVISIONS,
    context: "Conso placard: 11 bâtons",
    from: cul,
  },
];

describe("Create provisions transactions", () => {
  let transactions: InMemoryProvisionsTransactions;
  let create: CreateProvisionsTransactions;

  describe.each`
    stickPrice | consumers                                      | expectedAmount | expectedContext
    ${60}      | ${[{ consumer: drapsag.id, consumption: 20 }]} | ${1200}        | ${"Conso placard: 20 bâtons"}
    ${60}      | ${[{ consumer: drapsag.id, consumption: 1 }]}  | ${60}          | ${"Conso placard: 1 bâton"}
  `(
    "when provisions are consumed by one person",
    ({ stickPrice, consumers, expectedAmount, expectedContext }) => {
      beforeEach(() => {
        transactions = new InMemoryProvisionsTransactions(
          [drapsag, lea, cul],
          [],
        );
        create = new CreateProvisionsTransactions(transactions);
      });

      it("should create just one transaction", async () => {
        const transactions = await create.apply(stickPrice, consumers);
        expect(transactions).toHaveLength(1);
      });
      it("should create a transaction with the right amount", async () => {
        const transactions = await create.apply(stickPrice, consumers);
        expect(transactions[0].amount).toBe(expectedAmount);
      });
      it("should create a transaction with the provisions type", async () => {
        const transactions = await create.apply(stickPrice, consumers);
        expect(transactions[0].type).toBe(PROVISIONS);
      });
      it("should create a transaction with the right context", async () => {
        const transactions = await create.apply(stickPrice, consumers);
        expect(transactions[0].context).toBe(expectedContext);
      });
      it("should create a transaction with the right consumer", async () => {
        const transactions = await create.apply(stickPrice, consumers);
        expect(transactions[0].from).toBe(drapsag);
      });
      it("should create a transaction with a date", async () => {
        const transactions = await create.apply(stickPrice, consumers);
        expect(transactions[0].date).toBeInstanceOf(Date);
      });
      it("should add the transaction to the list of transactions", async () => {
        await create.apply(stickPrice, consumers);
        expect(transactions.all).toHaveLength(1);
      });
    },
  );

  describe.each`
    stickPrice | consumers         | expectedTransactions
    ${60}      | ${twoConsumers}   | ${expectedTransactionsForTwoConsumers}
    ${60}      | ${threeConsumers} | ${expectedTransactionsForThreeConsumers}
  `(
    "when provisions are consumed by multiple people",
    ({ stickPrice, consumers, expectedTransactions }) => {
      beforeEach(() => {
        transactions = new InMemoryProvisionsTransactions(
          [drapsag, lea, cul],
          [],
        );
        create = new CreateProvisionsTransactions(transactions);
      });

      it("should create a transaction for each consumer", async () => {
        const transactions = await create.apply(stickPrice, consumers);
        expect(transactions).toEqual(expectedTransactions);
      });
      it("should add the transactions to the list of transactions", async () => {
        await create.apply(stickPrice, consumers);
        expect(transactions.all).toHaveLength(consumers.length);
      });
      it("should create transactions with right information", async () => {
        const transactions = await create.apply(stickPrice, consumers);
        expect(transactions).toEqual(expectedTransactions);
      });
    },
  );

  describe("when provisions are consumed by at least one person with negative consumption", () => {
    const consumers = [
      { consumer: drapsag.id, consumption: 1 },
      { consumer: lea.id, consumption: -3 },
    ];
    it("should indicate that consumption cannot be negative", () => {
      const applyConsumption = () => create.apply(60, consumers);
      expect(applyConsumption).rejects.toThrow(
        AtLeastOneInsufficientConsumption,
      );
    });
  });
  describe("when provisions are consumed by at least one person with null consumption", () => {
    const consumers = [
      { consumer: drapsag.id, consumption: 0 },
      { consumer: lea.id, consumption: 1 },
    ];
    it("should indicate that consumption cannot be null", () => {
      const applyConsumption = () => create.apply(60, consumers);
      expect(applyConsumption).rejects.toThrow(
        AtLeastOneInsufficientConsumption,
      );
    });
  });
  describe("when provisions are consumed by zero person", () => {
    it("should indicate that at least one consumer is required", () => {
      const applyConsumption = () => create.apply(60, []);
      expect(applyConsumption).rejects.toThrow(NoConsumer);
    });
  });
  describe("when create transactions with negative stick price", () => {
    it("should indicate that stick price cannot be negative", () => {
      const consumers = [{ consumer: drapsag.id, consumption: 1 }];
      const applyConsumption = () => create.apply(-60, consumers);
      expect(applyConsumption).rejects.toThrow(InsufficientStickPrice);
    });
  });
  describe("when create transactions with null stick price", () => {
    it("should indicate that stick price cannot be null", () => {
      const consumers = [{ consumer: drapsag.id, consumption: 1 }];
      const applyConsumption = () => create.apply(0, consumers);
      expect(applyConsumption).rejects.toThrow(InsufficientStickPrice);
    });
  });
});
