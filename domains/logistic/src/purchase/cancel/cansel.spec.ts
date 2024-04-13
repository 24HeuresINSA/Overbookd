import { describe, expect, it } from "vitest";
import { leroyMerlinPurchase } from "../purchase.fake";
import { InMemoryPurchases } from "./purchase.inmemory";
import { CancelPurchase } from "./cancel";

describe("Cancel Purchase", () => {
  describe("when cancelling purchase from Leroy Merlin", async () => {
    const purchases = new InMemoryPurchases([leroyMerlinPurchase]);
    const cancel = new CancelPurchase(purchases);
    await cancel.apply(leroyMerlinPurchase.id);

    it("should remove it from the repository", () => {
      expect(purchases.all).not.toContainEqual(leroyMerlinPurchase);
    });
  });
});
