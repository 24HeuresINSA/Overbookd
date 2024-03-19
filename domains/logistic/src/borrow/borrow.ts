export type Gear = {
  slug: string;
  name: string;
};

export type GearRequest = Gear & {
  quantity: number;
};

export type Borrow = {
  id: number;
  lender: string;
  availableOn: Date;
  unavailableOn: Date;
  gears: GearRequest[];
};
