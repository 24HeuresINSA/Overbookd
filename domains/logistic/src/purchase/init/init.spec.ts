import { describe, it, expect } from "vitest";
import { friday17At12 } from "../../logistic.test-utils.js";
import { InMemoryPurchases } from "./purchase.inmemory.js";
import { InitPurchase, InitPurchaseForm } from "./init.js";

describe("Init purchase", () => {
  const purchases = new InMemoryPurchases();
  const init = new InitPurchase(purchases);

  describe("when initializing a purchase for Leroy Merlin", async () => {
    const form: InitPurchaseForm = {
      seller: "Leroy Merlin",
      availableOn: friday17At12,
    };
    const initializedPurchase = await init.apply(form);
    it("should initialize a purchase for Leroy Merlin", () => {
      expect(initializedPurchase.seller).toBe("Leroy Merlin");
    });
    it("should initialize the available date", () => {
      expect(initializedPurchase.availableOn).toEqual(friday17At12);
    });
    it("should generate empty gears", () => {
      expect(initializedPurchase.gears).toEqual([]);
    });
    it("should generate an id", () => {
      expect(initializedPurchase.id).toEqual(expect.any(Number));
    });
    it("should save it to the repository", () => {
      expect(purchases.all).toContainEqual(initializedPurchase);
    });
  });
});
