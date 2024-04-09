import { GearRequest } from "../gear-request";

export type Borrow = {
  id: number;
  lender: string;
  availableOn: Date;
  unavailableOn: Date;
  gears: GearRequest[];
};
