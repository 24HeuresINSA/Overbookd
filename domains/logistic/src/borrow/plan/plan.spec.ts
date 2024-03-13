import { describe, it, expect } from "vitest";
import { InMemoryBorrows } from "./borrow.inmemory";
import { karnaBorrow } from "../borrow.test-utils";
import { PlanBorrow } from "./plan";
import { BorrowNotFound } from "../borrow.error";

describe("Update borrow", () => {
  describe("when updating borrow from KARNA name", async () => {
    const borrows = new InMemoryBorrows([karnaBorrow]);
    const update = new PlanBorrow(borrows);
    await update.lender(karnaBorrow.id, "KLS");

    it("should update borrow name", () => {
      const borrow = borrows.all.find((sheet) => sheet.id === karnaBorrow.id);
      expect(borrow?.lender).toBe("KLS");
    });
    it("should save it to the repository", () => {
      expect(borrows.all).toContainEqual({ id: karnaBorrow.id, lender: "KLS" });
    });
  });
  describe("when updating a borrow that does not exist", async () => {
    const borrows = new InMemoryBorrows();
    const update = new PlanBorrow(borrows);

    it("should indicate that the borrow does not exist", () => {
      expect(update.lender(100, "KLS")).rejects.toThrowError(BorrowNotFound);
    });
  });
});
