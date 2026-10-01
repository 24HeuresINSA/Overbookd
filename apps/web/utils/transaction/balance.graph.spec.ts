import { describe, expect, it } from "vitest";
import {
  BARREL,
  DEPOSIT,
  type MyTransaction,
} from "@overbookd/personal-account";
import { calculateBalanceByDates } from "./balance.graph";

const deposit: MyTransaction = {
  type: DEPOSIT,
  amount: 1000,
  context: "Recharge",
  date: new Date("2026-08-15"),
};
const barrel: MyTransaction = {
  type: BARREL,
  amount: 300,
  context: "Fût",
  date: new Date("2026-09-10"),
};

describe("calculateBalanceByDates", () => {
  it("should start from zero without a start date", () => {
    expect(calculateBalanceByDates([barrel, deposit])).toEqual([
      { date: deposit.date, balance: 1000 },
      { date: barrel.date, balance: 700 },
    ]);
  });

  it("should start from the balance at the given date", () => {
    const from = new Date("2026-09-01");
    expect(calculateBalanceByDates([deposit, barrel], from)).toEqual([
      { date: from, balance: 1000 },
      { date: barrel.date, balance: 700 },
    ]);
  });
});
