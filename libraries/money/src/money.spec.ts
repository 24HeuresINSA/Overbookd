import { describe, it, expect } from "vitest";
import { Money } from "./money";

describe("Converting cents and euros", () => {
  describe.each`
    cents   | euros    | string
    ${100}  | ${1}     | ${"1.00 €"}
    ${770}  | ${7.7}   | ${"7.70 €"}
    ${870}  | ${8.7}   | ${"8.70 €"}
    ${970}  | ${9.7}   | ${"9.70 €"}
    ${1974} | ${19.74} | ${"19.74 €"}
  `("when converting $cents in euros", ({ cents, euros, string }) => {
    it(`should indicate ${euros} euros`, () => {
      const money = Money.cents(cents);
      expect(money.inEuros).toBe(euros);
    });
    it(`should display ${string} for readability`, () => {
      const money = Money.cents(cents);
      expect(money.toString()).toBe(string);
    });
  });

  describe.each`
    cents   | euros         | string
    ${100}  | ${1}          | ${"1.00 €"}
    ${770}  | ${7.7}        | ${"7.70 €"}
    ${870}  | ${8.7}        | ${"8.70 €"}
    ${970}  | ${9.7}        | ${"9.70 €"}
    ${1974} | ${19.74}      | ${"19.74 €"}
    ${1974} | ${19.7412464} | ${"19.74 €"}
  `("when converting $euros in cents", ({ cents, euros, string }) => {
    it(`should indicate ${cents} cents`, () => {
      const money = Money.euros(euros);
      expect(money.inCents).toBe(cents);
    });
    it(`should display ${string} for readability`, () => {
      const money = Money.euros(euros);
      expect(money.toString()).toBe(string);
    });
  });
});
