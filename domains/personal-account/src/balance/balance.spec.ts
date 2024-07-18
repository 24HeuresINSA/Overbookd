import { describe, expect, it } from "vitest";
import { Balance } from "./balance";

describe("Balance", () => {
  describe.each`
    context                                              | ISent                                | IReceived           | expectedBalance
    ${"without transaction"}                             | ${[]}                                | ${[]}               | ${0}
    ${"with one transaction I received"}                 | ${[]}                                | ${[{ amount: 10 }]} | ${10}
    ${"with one transaction I sent"}                     | ${[{ amount: 10 }]}                  | ${[]}               | ${-10}
    ${"with one transaction I received and one I sent"}  | ${[{ amount: 10 }]}                  | ${[{ amount: 10 }]} | ${0}
    ${"with two transactions I sent and one I received"} | ${[{ amount: 10 }, { amount: 200 }]} | ${[{ amount: 5 }]}  | ${-205}
  `("calculate balance $context", ({ ISent, IReceived, expectedBalance }) => {
    it("should return the right balance", () => {
      const form = { transactionsFrom: ISent, transactionsTo: IReceived };
      const balance = Balance.calculate(form);
      expect(balance).toBe(expectedBalance);
    });
  });
});
