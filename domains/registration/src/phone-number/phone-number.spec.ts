import { describe, expect, it } from "vitest";
import { isMobilePhoneNumberValid, isPhoneNumberValid } from "./phone-number";

describe("Phone number rules", () => {
  describe.each`
    phoneNumber           | valid
    ${""}                 | ${false}
    ${"0621361323812735"} | ${false}
    ${"0201020103"}       | ${false}
    ${"0201020103"}       | ${false}
    ${"+33601020103"}     | ${true}
    ${"+51987654321"}     | ${true}
    ${"0601020103"}       | ${true}
    ${"07 87 65 43 21"}   | ${true}
  `(
    "when mobile phone is filled with $phoneNumber",
    ({ phoneNumber, valid }) => {
      const validity = valid ? "valid" : "invalid";
      it(`should indicate that mobile phone is ${validity}`, () => {
        const isValid = isMobilePhoneNumberValid(phoneNumber);
        expect(isValid).toBe(valid);
      });
    },
  );
  describe.each`
    phoneNumber           | valid
    ${""}                 | ${false}
    ${"0621361323812735"} | ${false}
    ${"0201020103"}       | ${false}
    ${"0201020103"}       | ${false}
    ${"+33601020103"}     | ${true}
    ${"+51987654321"}     | ${true}
    ${"0601020103"}       | ${true}
    ${"07 87 65 43 21"}   | ${true}
    ${"0478270138"}       | ${true}
    ${"03 78 01 01 02"}   | ${true}
  `(
    "when phone number is filled with $phoneNumber",
    ({ phoneNumber, valid }) => {
      const validity = valid ? "valid" : "invalid";
      it(`should indicate that phone number is ${validity}`, () => {
        const isValid = isPhoneNumberValid(phoneNumber);
        expect(isValid).toBe(valid);
      });
    },
  );
});
