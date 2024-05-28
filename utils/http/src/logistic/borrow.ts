import { GearRequest } from "@overbookd/logistic";

export type AddGearRequestForm = {
  slug: GearRequest["slug"];
  quantity: GearRequest["quantity"];
};
