export type GearRequest = {
  slug: string;
  name: string;
  quantity: number;
};

export type Borrow = {
  id: number;
  lender: string;
  availableOn: Date;
  unavailableOn: Date;
  gears: GearRequest[];
};
