import { describe, it, expect } from "vitest";
import { InMemoryBorrows } from "./borrow.inmemory";
import { karnaSheet } from "../borrow.test-utils";
import { UpdateBorrow } from "./update";
import { BorrowNotFound } from "../borrow.error";

describe("Update borrow", () => {
  describe("when a user update borrow from KARNA", async () => {
    const borrows = new InMemoryBorrows([karnaSheet]);
    const update = new UpdateBorrow(borrows);
    await update.lender(karnaSheet.id, "KLS");

    it("should update it to the repository", () => {
      const borrow = borrows.all.find((sheet) => sheet.id === karnaSheet.id);
      expect(borrow?.lender).toBe("KLS");
    });
  });
  describe("when a user update a borrow that does not exist", async () => {
    const borrows = new InMemoryBorrows();
    const update = new UpdateBorrow(borrows);

    it("should indicate that the borrow does not exist", () => {
      expect(update.lender(100, "KLS")).rejects.toThrowError(BorrowNotFound);
    });
  });
});
