import { friday17At12, table } from "../logistic.test-utils";
import { Purchase } from "./purchase";

export const leroyMerlinPurchase: Purchase = {
  id: 1,
  seller: "Leroy Merlin",
  availableOn: friday17At12,
  gears: [{ ...table, quantity: 2 }],
};
