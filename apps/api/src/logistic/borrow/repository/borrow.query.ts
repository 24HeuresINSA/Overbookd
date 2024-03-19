import { Borrow } from "@overbookd/logistic";

const SELECT_GEAR_REQUEST = {
  gear: {
    select: {
      slug: true,
      name: true,
    },
  },
  quantity: true,
};

export const SELECT_BORROW = {
  id: true,
  lender: true,
  availableOn: true,
  unavailableOn: true,
  gears: { select: SELECT_GEAR_REQUEST },
};

type DatabaseBorrow = {
  id: number;
  lender: string;
  availableOn: Date;
  unavailableOn: Date;
  gears: {
    gear: {
      slug: string;
      name: string;
    };
    quantity: number;
  }[];
};

export class BorrowQueryBuilder {
  static create({ lender, availableOn, unavailableOn }: Borrow) {
    return { lender, availableOn, unavailableOn };
  }

  static update({ lender, availableOn, unavailableOn, gears }: Borrow) {
    return {
      lender,
      availableOn,
      unavailableOn,
      gears: this.upsertGears(gears),
    };
  }

  private static upsertGears(gears: Borrow["gears"]) {
    return {
      upsert: gears.map(({ slug, quantity }) => ({
        where: { gearSlug: slug },
        create: { gearSlug: slug, quantity },
        update: { quantity },
      })),
    };
  }
}

export function toBorrow(borrow: DatabaseBorrow): Borrow {
  return {
    id: borrow.id,
    lender: borrow.lender,
    availableOn: borrow.availableOn,
    unavailableOn: borrow.unavailableOn,
    gears: borrow.gears.map((gear) => ({
      ...gear.gear,
      quantity: gear.quantity,
    })),
  };
}
