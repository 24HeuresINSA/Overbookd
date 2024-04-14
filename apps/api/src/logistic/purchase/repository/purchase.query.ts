import { Purchase } from "@overbookd/logistic";

const SELECT_GEAR_REQUEST = {
  gear: {
    select: {
      slug: true,
      name: true,
    },
  },
  quantity: true,
};

export const SELECT_PURCHASE = {
  id: true,
  seller: true,
  availableOn: true,
  gears: { select: SELECT_GEAR_REQUEST },
};

type DatabasePurchase = {
  id: number;
  seller: string;
  availableOn: Date;
  gears: {
    gear: {
      slug: string;
      name: string;
    };
    quantity: number;
  }[];
};

export class PurchaseQueryBuilder {
  static create({ id, seller, availableOn }: Purchase) {
    return { id, seller, availableOn };
  }

  static update(purchase: Purchase) {
    const gears = this.upsertGears(purchase);
    return { ...purchase, gears };
  }

  private static upsertGears({ id, gears }: Purchase) {
    return {
      upsert: gears.map(({ slug, quantity }) => ({
        where: { purchaseId_gearSlug: { purchaseId: id, gearSlug: slug } },
        create: { gearSlug: slug, quantity },
        update: { quantity },
      })),
      deleteMany: {
        purchaseId: id,
        gearSlug: { notIn: gears.map(({ slug }) => slug) },
      },
    };
  }
}

export function toPurchase(purchase: DatabasePurchase): Purchase {
  return {
    id: purchase.id,
    seller: purchase.seller,
    availableOn: purchase.availableOn,
    gears: purchase.gears.map((gear) => ({
      ...gear.gear,
      quantity: gear.quantity,
    })),
  };
}
