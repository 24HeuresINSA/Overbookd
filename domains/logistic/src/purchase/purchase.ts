import { GearRequest } from "../gear-request.js";

export type Purchase = {
  id: number;
  seller: string;
  availableOn: Date;
  gears: GearRequest[];
};
