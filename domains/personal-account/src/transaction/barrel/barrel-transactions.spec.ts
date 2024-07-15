import { beforeEach, describe, it, expect } from "vitest";
import { BARREL, TransactionUser } from "../transaction";
import { InMemoryBarrelTransactions } from "./barrel-transactions.inmemory";
import { CreateBarrelTransactions } from "./create-barrel-transactions";
import { ConfiguredBarrel } from "../../barrel-prices/define-barrel-price";
import {
  AtLeastOneInsufficientConsumption,
  NoConsumer,
} from "../transaction.error";

const ambree: ConfiguredBarrel = {
  slug: "ambree",
  drink: "Ambrée",
  price: 8000,
  openedOn: new Date("2024-07-10"),
};
const blonde: ConfiguredBarrel = {
  slug: "blonde",
  drink: "Blonde",
  price: 10000,
  openedOn: new Date("2024-02-22"),
};

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

const twoConsumersForBlonde = [
  { consumer: drapsag.id, consumption: 4 },
  { consumer: lea.id, consumption: 1 },
];
const expectedTransactionsForTwoConsumersForBlonde = [
  {
    amount: 8000,
    date: expect.any(Date),
    type: BARREL,
    context: "Fût de Blonde du 22/02: 4 bâtons",
    from: drapsag,
  },
  {
    amount: 2000,
    date: expect.any(Date),
    type: BARREL,
    context: "Fût de Blonde du 22/02: 1 bâton",
    from: lea,
  },
];

const threeConsumersForAmbree = [
  { consumer: drapsag.id, consumption: 1 },
  { consumer: lea.id, consumption: 3 },
  { consumer: cul.id, consumption: 11 },
];
const expectedTransactionsForThreeConsumersForAmbree = [
  {
    amount: 534, // 533.33
    date: expect.any(Date),
    type: BARREL,
    context: "Fût de Ambrée du 10/07: 1 bâton",
    from: drapsag,
  },
  {
    amount: 1600,
    date: expect.any(Date),
    type: BARREL,
    context: "Fût de Ambrée du 10/07: 3 bâtons",
    from: lea,
  },
  {
    amount: 5867, // 5866.66
    date: expect.any(Date),
    type: BARREL,
    context: "Fût de Ambrée du 10/07: 11 bâtons",
    from: cul,
  },
];

describe("Create barrel transactions", () => {
  let transactions: InMemoryBarrelTransactions;
  let create: CreateBarrelTransactions;

  describe.each`
    barrel    | consumers                                      | expectedContext
    ${ambree} | ${[{ consumer: drapsag.id, consumption: 20 }]} | ${"Fût de Ambrée du 10/07: 20 bâtons"}
    ${blonde} | ${[{ consumer: drapsag.id, consumption: 1 }]}  | ${"Fût de Blonde du 22/02: 1 bâton"}
  `(
    "when barrel is consumed by only one person",
    ({ barrel, consumers, expectedContext }) => {
      beforeEach(() => {
        transactions = new InMemoryBarrelTransactions([drapsag, lea, cul], []);
        create = new CreateBarrelTransactions(transactions);
      });

      it("should create just one transaction", async () => {
        const transactions = await create.apply(barrel, consumers);
        expect(transactions).toHaveLength(1);
      });
      it("should create a transaction with the amount of the barrel", async () => {
        const transactions = await create.apply(barrel, consumers);
        expect(transactions[0].amount).toBe(barrel.price);
      });
      it("should create a transaction with the barrel type", async () => {
        const transactions = await create.apply(barrel, consumers);
        expect(transactions[0].type).toBe(BARREL);
      });
      it("should create a transaction with the right context", async () => {
        const transactions = await create.apply(barrel, consumers);
        expect(transactions[0].context).toBe(expectedContext);
      });
      it("should create a transaction with the right consumer", async () => {
        const transactions = await create.apply(barrel, consumers);
        expect(transactions[0].from).toBe(drapsag);
      });
      it("should create a transaction with a date", async () => {
        const transactions = await create.apply(barrel, consumers);
        expect(transactions[0].date).toBeInstanceOf(Date);
      });
      it("should add the transaction to the list of transactions", async () => {
        await create.apply(barrel, consumers);
        expect(transactions.all).toHaveLength(1);
      });
    },
  );

  describe.each`
    barrel    | consumers                  | expectedTransactions
    ${blonde} | ${twoConsumersForBlonde}   | ${expectedTransactionsForTwoConsumersForBlonde}
    ${ambree} | ${threeConsumersForAmbree} | ${expectedTransactionsForThreeConsumersForAmbree}
  `(
    "when barrel is consumed by multiple people",
    ({ barrel, consumers, expectedTransactions }) => {
      beforeEach(() => {
        transactions = new InMemoryBarrelTransactions([drapsag, lea, cul], []);
        create = new CreateBarrelTransactions(transactions);
      });

      it("should create a transaction for each consumer", async () => {
        const transactions = await create.apply(barrel, consumers);
        expect(transactions).toEqual(expectedTransactions);
      });
      it("should add the transactions to the list of transactions", async () => {
        await create.apply(barrel, consumers);
        expect(transactions.all).toHaveLength(consumers.length);
      });
      it("should create transactions with right information", async () => {
        const transactions = await create.apply(barrel, consumers);
        expect(transactions).toEqual(expectedTransactions);
      });
    },
  );

  describe("when barrel is consumed by at least one person with negative consumption", () => {
    const consumers = [
      { consumer: drapsag.id, consumption: 1 },
      { consumer: lea.id, consumption: -3 },
    ];
    it("should indicate that consumption cannot be negative", () => {
      const applyConsumption = () => create.apply(ambree, consumers);
      expect(applyConsumption).rejects.toThrow(
        AtLeastOneInsufficientConsumption,
      );
    });
  });
  describe("when barrel is consumed by at least one person with null consumption", () => {
    const consumers = [
      { consumer: drapsag.id, consumption: 0 },
      { consumer: lea.id, consumption: 1 },
    ];
    it("should indicate that consumption cannot be null", () => {
      const applyConsumption = () => create.apply(ambree, consumers);
      expect(applyConsumption).rejects.toThrow(
        AtLeastOneInsufficientConsumption,
      );
    });
  });
  describe("when barrel is consumed by zero person", () => {
    it("should indicate that at least one consumer is required", () => {
      const applyConsumption = () => create.apply(ambree, []);
      expect(applyConsumption).rejects.toThrow(NoConsumer);
    });
  });
});
