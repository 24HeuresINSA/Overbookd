import { GearRequest } from "../gear-request.js";

export type Borrow = {
  id: number;
  lender: string;
  availableOn: Date;
  unavailableOn: Date;
  gears: GearRequest[];
};
