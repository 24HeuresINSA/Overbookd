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
