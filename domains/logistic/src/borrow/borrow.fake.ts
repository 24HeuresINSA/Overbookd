import { friday17At12, sunday20At10, table } from "../logistic.test-utils.js";
import { Borrow } from "./borrow.js";

export const karnaBorrow: Borrow = {
  id: 1,
  lender: "KARNA",
  availableOn: friday17At12,
  unavailableOn: sunday20At10,
  gears: [{ ...table, quantity: 2 }],
};
