import { describe, it, expect } from "vitest";
import { InMemoryBorrows } from "./borrow.inmemory";
import { chaise, karnaBorrow, table } from "../borrow.test-utils";
import { PlanBorrow } from "./plan";
import { BorrowNotFound } from "../borrow.error";

describe("Plan borrow", () => {
  describe("when changing lender", async () => {
    const borrows = new InMemoryBorrows([karnaBorrow]);
    const plan = new PlanBorrow(borrows);
    await plan.changeLender(karnaBorrow.id, "KLS");

    it("should save it to the repository", () => {
      expect(borrows.all).toContainEqual({ ...karnaBorrow, lender: "KLS" });
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
  describe("when planning to pick up a gear", async () => {
    const borrows = new InMemoryBorrows([karnaBorrow]);
    const plan = new PlanBorrow(borrows);
    const { gearsToTake } = await plan.pickUpGear(karnaBorrow.id, chaise);

    it("should plan it", () => {
      expect(gearsToTake).toContainEqual(chaise);
    });
  });
  describe("when planning to cancel a gear to pick up", async () => {
    const borrows = new InMemoryBorrows([karnaBorrow]);
    const plan = new PlanBorrow(borrows);
    const { gearsToTake } = await plan.cancelGearToPickUp(
      karnaBorrow.id,
      karnaBorrow.gearsToTake[0].slug,
    );

    it("should cancel it", () => {
      expect(gearsToTake).not.toContainEqual(table);
    });
  });
});
