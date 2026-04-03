import { describe, expect, it } from "vitest";
import {
  formatEmailLink,
  formatPhoneLink,
  formatPhoneNumber,
  isMobilePhoneNumberValid,
  isPhoneNumberValid,
} from "./phone-number";

describe("Phone number rules", () => {
  describe.each`
    phoneNumber           | valid
    ${""}                 | ${false}
    ${"0621361323812735"} | ${false}
    ${"0201020103"}       | ${false}
    ${"0601020103"}       | ${true}
    ${"07 87 65 43 21"}   | ${true}
    ${"+33601020103"}     | ${true}
    ${"+51 987 654 321"}  | ${true}
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
    ${"0201020103"}       | ${true}
    ${"0601020103"}       | ${true}
    ${"07 87 65 43 21"}   | ${true}
    ${"0478270138"}       | ${true}
    ${"03 78 01 01 02"}   | ${true}
    ${"+33601020103"}     | ${true}
    ${"+51 987 654 321"}  | ${true}
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

describe("Phone number format", () => {
  describe.each`
    phoneNumber           | expectedFormattedNumber
    ${""}                 | ${""}
    ${"0621361323812735"} | ${"0621361323812735"}
    ${"+33601020103"}     | ${"06 01 02 01 03"}
    ${"07 87 65 43 21"}   | ${"07 87 65 43 21"}
    ${"+51987654321"}     | ${"+51 987 654 321"}
    ${"+12135550123"}     | ${"+1 213-555-0123"}
  `(
    "when formatting $phoneNumber",
    ({ phoneNumber, expectedFormattedNumber }) => {
      it(`should format it to ${expectedFormattedNumber}`, () => {
        const formattedNumer = formatPhoneNumber(phoneNumber);
        expect(formattedNumer).toBe(expectedFormattedNumber);
      });
    },
  );
  describe.each`
    phoneNumber           | expectedPhoneLink
    ${""}                 | ${"tel:"}
    ${"0621361323812735"} | ${"tel:0621361323812735"}
    ${"0201020103"}       | ${"tel:+33-2-01-02-01-03"}
    ${"07 87 65 43 21"}   | ${"tel:+33-7-87-65-43-21"}
    ${"+33601020103"}     | ${"tel:+33-6-01-02-01-03"}
    ${"+51987654321"}     | ${"https://wa.me/+51987654321"}
    ${"+1 213-555-0123"}  | ${"https://wa.me/+12135550123"}
  `(
    "when formatting $phoneNumber to phone link",
    ({ phoneNumber, expectedPhoneLink }) => {
      it(`should format it to ${expectedPhoneLink}`, () => {
        const formattedLink = formatPhoneLink(phoneNumber);
        expect(formattedLink).toBe(expectedPhoneLink);
      });
    },
  );
});

describe("Email format", () => {
  describe.each`
    email                 | expectedEmailLink
    ${"dsi@24heures.org"} | ${"mailto:dsi@24heures.org"}
    ${"test@test.test"}   | ${"mailto:test@test.test"}
  `("when formatting $email to email link", ({ email, expectedEmailLink }) => {
    it(`should format it to ${expectedEmailLink}`, () => {
      const formattedLink = formatEmailLink(email);
      expect(formattedLink).toBe(expectedEmailLink);
    });
  });
});
