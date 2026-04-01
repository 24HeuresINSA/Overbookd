import { describe, expect, it } from "vitest";
import { isMobilePhoneNumberValid } from "./phone-number";

describe("Phone number rules", () => {
  describe.each`
    mobilePhone           | valid
    ${""}                 | ${false}
    ${"0621361323812735"} | ${false}
    ${"0201020103"}       | ${false}
    ${"0201020103"}       | ${false}
    ${"+33601020103"}     | ${true}
    ${"+51987654321"}     | ${true}
    ${"0601020103"}       | ${true}
    ${"07 87 65 43 21"}   | ${true}
  `(
    "when mobile phone is filled with $mobilePhone",
    ({ mobilePhone, valid }) => {
      const validity = valid ? "valid" : "invalid";
      it(`should indicate that mobile phone is ${validity}`, () => {
        const isValid = isMobilePhoneNumberValid(mobilePhone);
        expect(isValid).toBe(valid);
      });
    },
  );
});
