import { describe, it, expect } from "@jest/globals";
import { computeUnitPrice } from "./drink-consumption";

describe("Volonteer drink consumptions", () => {
  describe.each`
    barrelPrice | consumptions | expectedUnitPrice
    ${50}       | ${50}        | ${1}
    ${50}       | ${25}        | ${2}
    ${100}      | ${99}        | ${1.05}
    ${74.42}    | ${35}        | ${2.15}
    ${149}      | ${100}       | ${1.5}
  `(
    "When a barrel cost $barrelPrice and volunteer consume $consumptions times",
    ({ barrelPrice, consumptions, expectedUnitPrice }) => {
      it(`shoud compute unit price to ${expectedUnitPrice}`, () => {
        expect(computeUnitPrice(barrelPrice, consumptions)).toBe(
          expectedUnitPrice
        );
      });
    }
  );
});
