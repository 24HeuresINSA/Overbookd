import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryBorrows } from "./borrow.inmemory";
import { PlanBorrow } from "./plan";
import {
  AlreadyAddedGear,
  BorrowNotFound,
  NotEnoughQuantity,
} from "../borrow.error";
import { karnaBorrow } from "../borrow.fake";
import { chaise, monday21At10, saturday19At16, table } from "../../logistic.test-utils";

describe("Plan borrow", () => {
  let borrows: InMemoryBorrows;
  let plan: PlanBorrow;

  beforeEach(() => {
    borrows = new InMemoryBorrows([karnaBorrow]);
    plan = new PlanBorrow(borrows);
  });
  describe.each`
    explanation                                | borrow         | update                                                                         | lender                | availableOn                | unavailableOn
    ${"lender"}                                | ${karnaBorrow} | ${{ lender: "KLS" }}                                                           | ${"KLS"}              | ${karnaBorrow.availableOn} | ${karnaBorrow.unavailableOn}
    ${"availableOn"}                           | ${karnaBorrow} | ${{ availableOn: saturday19At16 }}                                             | ${karnaBorrow.lender} | ${saturday19At16}          | ${karnaBorrow.unavailableOn}
    ${"unavailableOn"}                         | ${karnaBorrow} | ${{ unavailableOn: saturday19At16 }}                                           | ${karnaBorrow.lender} | ${karnaBorrow.availableOn} | ${saturday19At16}
    ${"availableOn and unavailableOn"}         | ${karnaBorrow} | ${{ availableOn: saturday19At16, unavailableOn: monday21At10 }}                | ${karnaBorrow.lender} | ${saturday19At16}          | ${monday21At10}
    ${"lender, availableOn and unavailableOn"} | ${karnaBorrow} | ${{ lender: "KLS", availableOn: saturday19At16, unavailableOn: monday21At10 }} | ${"KLS"}              | ${saturday19At16}          | ${monday21At10}
  `(
    "when planning $explanation from a borrow",
    ({ borrow, update, lender, availableOn, unavailableOn }) => {
      it("should update the borrow", async () => {
        const updated = await plan.update(borrow.id, update);

        expect(updated.lender).toBe(lender);
        expect(updated.availableOn).toBe(availableOn);
        expect(updated.unavailableOn).toBe(unavailableOn);
      });
    },
  );
  describe("when planning a borrow that does not exist", () => {
    it("should indicate that borrow does not exist", async () => {
      const borrows = new InMemoryBorrows([karnaBorrow]);
      const plan = new PlanBorrow(borrows);

      await expect(plan.update(100, { lender: "KLS" })).rejects.toThrowError(
        BorrowNotFound,
      );
    });
  });
  describe("when adding a gear request to a borrow", () => {
    it("should add the gear request to the borrow", async () => {
      const request = { ...chaise, quantity: 4 };
      const updated = await plan.addGear(karnaBorrow.id, request);

      expect(updated.gears).toContainEqual(request);
    });
    describe("when the quantity of the gear request is lower than 1", () => {
      it("should indicate that the quantity must be at least 1", async () => {
        const request = { ...chaise, quantity: 0 };
        await expect(
          plan.addGear(karnaBorrow.id, request),
        ).rejects.toThrowError(NotEnoughQuantity);
      });
    });
    describe("when adding an already added gear", () => {
      it("should indicate that the gear is already added", async () => {
        const request = { ...table, quantity: 10 };
        await expect(
          plan.addGear(karnaBorrow.id, request),
        ).rejects.toThrowError(AlreadyAddedGear);
      });
    });
    describe("when the borrow does not exist", () => {
      it("should indicate that borrow does not exist", async () => {
        const request = { ...chaise, quantity: 4 };
        await expect(plan.addGear(100, request)).rejects.toThrowError(
          BorrowNotFound,
        );
      });
    });
  });

  describe("when removing a gear request from a borrow", () => {
    it("should remove the gear request from the borrow", async () => {
      const updated = await plan.removeGear(karnaBorrow.id, chaise.slug);

      expect(updated.gears).not.toContainEqual(chaise);
    });

    describe("when the borrow does not exist", () => {
      it("should indicate that borrow does not exist", async () => {
        await expect(plan.removeGear(100, chaise.slug)).rejects.toThrowError(
          BorrowNotFound,
        );
      });
    });
  });
});
