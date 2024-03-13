import { describe, it, expect } from "vitest";
import { InMemoryBorrows } from "./borrow.inmemory";
import { karnaBorrow } from "../borrow.test-utils";
import { PlanBorrow } from "./plan";
import { BorrowNotFound } from "../borrow.error";

describe("Plan borrow", () => {
  describe("when changing lender", async () => {
    const borrows = new InMemoryBorrows([karnaBorrow]);
    const plan = new PlanBorrow(borrows);
    await plan.changeLender(karnaBorrow.id, "KLS");

    it("should save it to the repository", () => {
      expect(borrows.all).toContainEqual({ id: karnaBorrow.id, lender: "KLS" });
    });
  });
  describe("when updating a borrow that does not exist", async () => {
    const borrows = new InMemoryBorrows();
    const plan = new PlanBorrow(borrows);

    it("should indicate that the borrow does not exist", () => {
      expect(plan.changeLender(100, "KLS")).rejects.toThrowError(
        BorrowNotFound,
      );
    });
  });
});
