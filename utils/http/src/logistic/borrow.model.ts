import { GearRequest } from "@overbookd/logistic";

export type AddBorrowGearRequestForm = {
  slug: GearRequest["slug"];
  quantity: GearRequest["quantity"];
};
