import { OverDate } from "@overbookd/period";
import { Borrow } from "./borrow";

export const chaise = {
  slug: "chaise",
  name: "Chaise",
};

const table = {
  slug: "table",
  name: "table",
};

export const friday17At12 = OverDate.init({
  date: "2024-05-17",
  hour: 12,
}).date;
export const saturday19At16 = OverDate.init({
  date: "2024-05-19",
  hour: 16,
}).date;
export const sunday20At10 = OverDate.init({
  date: "2024-05-20",
  hour: 10,
}).date;
export const monday21At10 = OverDate.init({
  date: "2024-05-21",
  hour: 10,
}).date;

export const karnaBorrow: Borrow = {
  id: 1,
  lender: "KARNA",
  availableOn: friday17At12,
  unavailableOn: sunday20At10,
  gears: [{ ...table, quantity: 2 }],
};
