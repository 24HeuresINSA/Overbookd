import { GearRequest } from "../gear-request";

export type Purchase = {
  id: number;
  seller: string;
  availableOn: Date;
  gears: GearRequest[];
};
