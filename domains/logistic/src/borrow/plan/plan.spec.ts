import { describe, it, expect } from "vitest";
import { InMemoryBorrows } from "./borrow.inmemory";
import {
  chaise,
  karnaBorrow,
  saturday19At16,
  table,
} from "../borrow.test-utils";
import { PlanBorrow } from "./plan";
import { BorrowNotFound } from "../borrow.error";

describe("Plan borrow", () => {
  describe.each`
    explanation        | borrow         | update                               | lender                | availableOn                | unavailableOn
    ${"lender"}        | ${karnaBorrow} | ${{ lender: "KLS" }}                 | ${"KLS"}              | ${karnaBorrow.availableOn} | ${karnaBorrow.unavailableOn}
    ${"availableOn"}   | ${karnaBorrow} | ${{ availableOn: saturday19At16 }}   | ${karnaBorrow.lender} | ${saturday19At16}          | ${karnaBorrow.unavailableOn}
    ${"unavailableOn"} | ${karnaBorrow} | ${{ unavailableOn: saturday19At16 }} | ${karnaBorrow.lender} | ${karnaBorrow.availableOn} | ${saturday19At16}
  `;
  describe("when updating a borrow that does not exist", async () => {
    const borrows = new InMemoryBorrows([karnaBorrow]);
    const plan = new PlanBorrow(borrows);

    it("should indicate that the borrow does not exist", () => {
      expect(plan.update(100, "KLS")).rejects.toThrowError(BorrowNotFound);
    });
  });
  describe("when planning to pick up a gear", async () => {
    const borrows = new InMemoryBorrows([karnaBorrow]);
    const plan = new PlanBorrow(borrows);
    const { gears } = await plan.addGear(karnaBorrow.id, chaise);

    it("should plan it", () => {
      expect(gears).toContainEqual(chaise);
    });
  });
  describe("when planning to cancel a gear to pick up", async () => {
    const borrows = new InMemoryBorrows([karnaBorrow]);
    const plan = new PlanBorrow(borrows);
    const { gearsToTake } = await plan.removeGear(
      karnaBorrow.id,
      karnaBorrow.gearsToTake[0].slug,
    );

    it("should cancel it", () => {
      expect(gearsToTake).not.toContainEqual(table);
    });
  });
});
