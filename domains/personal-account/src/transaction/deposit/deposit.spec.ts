import { beforeEach, describe, it, expect } from "vitest";
import { DEPOSIT, TransactionUser } from "../transaction.model";
import { InMemoryDeposits } from "./deposits.inmemory";
import { Deposit } from "./deposit";

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

describe("Deposit", () => {
  let deposits: InMemoryDeposits;
  let deposit: Deposit;

  beforeEach(() => {
    deposits = new InMemoryDeposits([olop, cul], []);
    deposit = new Deposit(deposits);
  });

  describe("when adding deposit from an adherent", () => {
    const newDepositForm = { amount: 10, depositor: olop.id };

    it("should create a deposit", async () => {
      const newDeposit = await deposit.apply(newDepositForm);
      expect(newDeposit.type).toBe(DEPOSIT);
    });
    it("should create a deposit with the right amount", async () => {
      const { amount } = await deposit.apply(newDepositForm);
      expect(amount).toBe(newDepositForm.amount);
    });
    it("should create a deposit with the right payee", async () => {
      const { to } = await deposit.apply(newDepositForm);
      expect(to).toBe(olop);
    });
    it("should create a deposit with the right context", async () => {
      const { context } = await deposit.apply(newDepositForm);
      expect(context).toBe("Recharge de compte perso");
    });
    it("should create a deposit with a date", async () => {
      const { date } = await deposit.apply(newDepositForm);
      expect(date).toBeInstanceOf(Date);
    });
    it("should add deposit to the list of deposits", async () => {
      const newDeposit = await deposit.apply(newDepositForm);
      expect(deposits.all).toEqual([newDeposit]);
    });

    describe("when adding another deposit from another adherent", async () => {
      const otherDepositForm = { amount: 20, depositor: cul.id };
      it("should add deposit to the list of deposits", async () => {
        const newDeposit = await deposit.apply(newDepositForm);
        const otherDeposit = await deposit.apply(otherDepositForm);

        expect(deposits.all).toEqual([newDeposit, otherDeposit]);
      });
    });
  });

  describe("when adding multiple deposits from adherents", () => {
    const depositForms = [
      { amount: 100, depositor: olop.id },
      { amount: 200, depositor: cul.id },
    ];

    it("should create multiple deposits", async () => {
      const newDeposits = await deposit.applyMultiple(depositForms);
      expect(newDeposits).toHaveLength(2);
    });
    it("should create right deposits", async () => {
      const newDeposits = await deposit.applyMultiple(depositForms);
      const baseDeposit = {
        context: "Recharge de compte perso",
        type: DEPOSIT,
        date: expect.any(Date),
      };
      const expected = [
        { ...baseDeposit, amount: 100, to: olop },
        { ...baseDeposit, amount: 200, to: cul },
      ];
      expect(newDeposits).toEqual(expected);
    });
    it("should add deposits to the list of deposits", async () => {
      await deposit.applyMultiple(depositForms);
      expect(deposits.all).toHaveLength(2);
    });
  });
});
