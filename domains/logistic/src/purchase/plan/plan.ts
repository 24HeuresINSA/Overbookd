import { NotEnoughQuantity } from "../../forms.error";
import { GearRequest, GearRequests } from "../../gear-request";
import { Purchase } from "../purchase";
import { PurchaseNotFound } from "../purchase.error";

export type PurchasesForPlan = {
  find(id: Purchase["id"]): Promise<Purchase | undefined>;
  save(purchase: Purchase): Promise<Purchase>;
};

type PlanPurchaseForm = {
  seller?: Purchase["seller"];
  availableOn?: Purchase["availableOn"];
};

export class PlanPurchase {
  constructor(private readonly purchases: PurchasesForPlan) {}

  async update(
    id: Purchase["id"],
    update: PlanPurchaseForm,
  ): Promise<Purchase> {
    const purchase = await this.purchases.find(id);
    if (!purchase) throw new PurchaseNotFound(id);

    const updated = { ...purchase, ...update };

    return this.purchases.save(updated);
  }

  async addGear(id: Purchase["id"], gear: GearRequest): Promise<Purchase> {
    const purchase = await this.purchases.find(id);
    if (!purchase) throw new PurchaseNotFound(id);

    if (gear.quantity < 1) throw new NotEnoughQuantity();

    const gearRequests = GearRequests.init(purchase.gears);
    const gears = gearRequests.add(gear).all;
    return this.purchases.save({ ...purchase, gears });
  }

  async removeGear(
    id: Purchase["id"],
    gearSlug: GearRequest["slug"],
  ): Promise<Purchase> {
    const purchase = await this.purchases.find(id);
    if (!purchase) throw new PurchaseNotFound(id);

    const gearRequests = GearRequests.init(purchase.gears);
    const gears = gearRequests.remove(gearSlug).all;
    return this.purchases.save({ ...purchase, gears });
  }
}
