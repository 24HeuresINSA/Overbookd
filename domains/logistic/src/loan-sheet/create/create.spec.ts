import { describe, it, expect } from "vitest";
import { CreateLoanSheet } from "./create";
import { InMemoryLoanSheets } from "./loan-sheet.inmemory";

describe("Create loan sheet", () => {
  describe("when a user create KARNA loan sheet", async () => {
    const loanSheets = new InMemoryLoanSheets();
    const create = new CreateLoanSheet(loanSheets);
    const createdLoanSheet = await create.for("KARNA");

    it("should create KARNA loan sheet", () => {
      expect(createdLoanSheet.lender).toBe("KARNA");
    });
    it("should generate an id", () => {
      expect(createdLoanSheet.id).toEqual(expect.any(Number));
    });
    it("should save it to the repository", () => {
      expect(loanSheets.all).toContainEqual(createdLoanSheet);
    });
  });
});
