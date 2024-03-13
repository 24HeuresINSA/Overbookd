import { describe, it, expect } from "vitest";
import { InMemoryLoanSheets } from "./loan-sheet.inmemory";
import { RemoveLoanSheet } from "./remove";
import { LoanSheet } from "../loan-sheet.model";

const karnaSheet: LoanSheet = {
  id: 1,
  lender: "KARNA",
};

describe("Remove loan sheet", () => {
  describe("when a user create KARNA loan sheet", async () => {
    const loanSheets = new InMemoryLoanSheets([karnaSheet]);
    const remove = new RemoveLoanSheet(loanSheets);
    await remove.apply(karnaSheet.id);

    it("should remove it to the repository", () => {
      expect(loanSheets.all).not.toContainEqual(karnaSheet);
    });
  });
});
