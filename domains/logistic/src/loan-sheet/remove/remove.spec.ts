import { describe, it, expect } from "vitest";
import { InMemoryLoanSheets } from "./loan-sheet.inmemory";
import { RemoveLoanSheet } from "./remove";
import { LoanSheetNotFound } from "../loan-sheet.error";
import { karnaSheet } from "../loan-sheet.test-utils";

describe("Remove loan sheet", () => {
  describe("when a user remove KARNA loan sheet", async () => {
    const loanSheets = new InMemoryLoanSheets([karnaSheet]);
    const remove = new RemoveLoanSheet(loanSheets);
    await remove.apply(karnaSheet.id);

    it("should remove it to the repository", () => {
      expect(loanSheets.all).not.toContainEqual(karnaSheet);
    });
  });
  describe("when a user remove a loan sheet that does not exist", async () => {
    const loanSheets = new InMemoryLoanSheets();
    const remove = new RemoveLoanSheet(loanSheets);

    it("should indicate that the loan sheet does not exist", () => {
      expect(remove.apply(100)).rejects.toThrowError(LoanSheetNotFound);
    });
  });
});
