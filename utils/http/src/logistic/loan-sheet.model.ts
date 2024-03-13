type Gear = {
  slug: string;
  name: string;
  quantity: number;
};

type GearArrival = Gear & {
  availableAt: Date;
};

type GearReturn = Gear & {
  unavailableAt: Date;
};

export type LoanSheet = {
  id: number;
  lender: string;
  arrivals: GearArrival[];
  returns: GearReturn[];
};
