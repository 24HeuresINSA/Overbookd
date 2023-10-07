import { describe, it, expect } from "@jest/globals";
import { computeUnitPrice } from "./drink-consumption";

describe("Volonteer drink consumptions", () => {
  describe.each`
    barrelPrice | consumptions | expectedUnitPrice
    ${5000}     | ${50}        | ${100}
    ${5000}     | ${25}        | ${200}
    ${10000}    | ${99}        | ${105}
    ${7442}     | ${35}        | ${215}
    ${14900}    | ${100}       | ${15}
  `(
    "When a barrel cost $barrelPrice and volunteer consume $consumptions times",
    ({ barrelPrice, consumptions, expectedUnitPrice }) => {
      it(`shoud compute unit price to ${expectedUnitPrice}`, () => {
        expect(computeUnitPrice(barrelPrice, consumptions)).toBe(
          expectedUnitPrice,
        );
      });
    },
  );
});
