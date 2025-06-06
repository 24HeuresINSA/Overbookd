import { beforeEach, describe, expect, it } from "vitest";
import { chaise, saturday19At16, table } from "../../logistic.test-utils.js";
import { NotEnoughQuantity } from "../../logistic.error.js";
import { InMemoryPurchases } from "./purchase.inmemory.js";
import { PlanPurchase } from "./plan.js";
import { PurchaseNotFound } from "../purchase.error.js";
import { leroyMerlinPurchase } from "../purchase.fake.js";

describe("Plan purchase", () => {
  let purchases: InMemoryPurchases;
  let plan: PlanPurchase;

  beforeEach(() => {
    purchases = new InMemoryPurchases([leroyMerlinPurchase]);
    plan = new PlanPurchase(purchases);
  });
  describe.each`
    explanation                 | purchase               | update                                                    | seller                        | availableOn
    ${"seller"}                 | ${leroyMerlinPurchase} | ${{ seller: "Brico Dépôt" }}                              | ${"Brico Dépôt"}              | ${leroyMerlinPurchase.availableOn}
    ${"availableOn"}            | ${leroyMerlinPurchase} | ${{ availableOn: saturday19At16 }}                        | ${leroyMerlinPurchase.seller} | ${saturday19At16}
    ${"seller and availableOn"} | ${leroyMerlinPurchase} | ${{ seller: "Brico Dépôt", availableOn: saturday19At16 }} | ${"Brico Dépôt"}              | ${saturday19At16}
  `(
    "when planning $explanation from a purchase",
    ({ purchase, update, seller, availableOn }) => {
      it("should update the purchase", async () => {
        const updated = await plan.update(purchase.id, update);

        expect(updated.seller).toBe(seller);
        expect(updated.availableOn).toBe(availableOn);
      });
    },
  );

  describe("when planning a purchase that does not exist", () => {
    it("should indicate that purchase does not exist", async () => {
      const purchases = new InMemoryPurchases([leroyMerlinPurchase]);
      const plan = new PlanPurchase(purchases);

      await expect(
        plan.update(100, { seller: "Brico Dépôt" }),
      ).rejects.toThrowError(PurchaseNotFound);
    });
  });

  describe("when adding a gear request to a purchase", () => {
    it("should add the gear request to the purchase", async () => {
      const request = { ...chaise, quantity: 4 };
      const updated = await plan.addGear(leroyMerlinPurchase.id, request);

      expect(updated.gears).toContainEqual(request);
    });
    describe("when the quantity of the gear request is lower than 1", () => {
      it("should indicate that the quantity must be at least 1", async () => {
        const request = { ...chaise, quantity: 0 };
        await expect(
          plan.addGear(leroyMerlinPurchase.id, request),
        ).rejects.toThrowError(NotEnoughQuantity);
      });
    });
    describe("when adding an already added gear", () => {
      it("should override quantity of the gear request", async () => {
        const request = { ...table, quantity: 10 };
        const updated = await plan.addGear(leroyMerlinPurchase.id, request);
        expect(updated.gears).toContainEqual(request);
        expect(updated.gears).toHaveLength(leroyMerlinPurchase.gears.length);
      });
    });
    describe("when the purchase does not exist", () => {
      it("should indicate that the purchase does not exist", async () => {
        const request = { ...chaise, quantity: 4 };
        await expect(plan.addGear(100, request)).rejects.toThrowError(
          PurchaseNotFound,
        );
      });
    });
  });

  describe("when removing a gear request from a purchase", () => {
    it("should remove the gear request from the purchase", async () => {
      const updated = await plan.removeGear(leroyMerlinPurchase.id, table.slug);

      expect(updated.gears).not.toContainEqual(table);
    });
    describe("when the purchase does not exist", () => {
      it("should indicate that the purchase does not exist", async () => {
        await expect(plan.removeGear(100, chaise.slug)).rejects.toThrowError(
          PurchaseNotFound,
        );
      });
    });
  });
});
