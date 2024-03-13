export type GearRequest = {
  slug: string;
  name: string;
  quantity: number;
};

export type Borrow = {
  id: number;
  lender: string;
  gearsToTake: GearRequest[];
  gearsToReturn: GearRequest[];
};
