import { describe, it, expect } from "vitest";
import { InMemoryBorrows } from "./borrow.inmemory";
import { RemoveBorrow } from "./remove";
import { BorrowNotFound } from "../borrow.error";
import { karnaSheet } from "../borrow.test-utils";

describe("Remove borrow", () => {
  describe("when a user remove borrow from KARNA", async () => {
    const borrows = new InMemoryBorrows([karnaSheet]);
    const remove = new RemoveBorrow(borrows);
    await remove.apply(karnaSheet.id);

    it("should remove it to the repository", () => {
      expect(borrows.all).not.toContainEqual(karnaSheet);
    });
  });
  describe("when a user remove a borrow that does not exist", async () => {
    const borrows = new InMemoryBorrows();
    const remove = new RemoveBorrow(borrows);

    it("should indicate that the borrow does not exist", () => {
      expect(remove.apply(100)).rejects.toThrowError(BorrowNotFound);
    });
  });
});
