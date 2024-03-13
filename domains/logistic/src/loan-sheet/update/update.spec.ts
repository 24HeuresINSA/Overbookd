import { describe, it, expect } from "vitest";
import { InMemoryLoanSheets } from "./loan-sheet.inmemory";
import { karnaSheet } from "../loan-sheet.test-utils";
import { UpdateLoanSheet } from "./update";
import { LoanSheetNotFound } from "../loan-sheet.error";

describe("Update loan sheet", () => {
  describe("when a user update KARNA loan sheet lender", async () => {
    const loanSheets = new InMemoryLoanSheets([karnaSheet]);
    const update = new UpdateLoanSheet(loanSheets);
    await update.lender(karnaSheet.id, "KLS");

    it("should update it to the repository", () => {
      const loanSheet = loanSheets.all.find(
        (sheet) => sheet.id === karnaSheet.id,
      );
      expect(loanSheet?.lender).toBe("KLS");
    });
  });
  describe("when a user update a loan sheet that does not exist", async () => {
    const loanSheets = new InMemoryLoanSheets();
    const update = new UpdateLoanSheet(loanSheets);

    it("should indicate that the loan sheet does not exist", () => {
      expect(update.lender(100, "KLS")).rejects.toThrowError(LoanSheetNotFound);
    });
  });
});
