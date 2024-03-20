import { OverDate } from "@overbookd/period";
import { Borrow, GearRequest } from "./borrow";

export const chaise: GearRequest = {
  slug: "chaise",
  name: "Chaise",
  quantity: 10,
};

export const table: GearRequest = {
  slug: "table",
  name: "table",
  quantity: 2,
};

export const friday17At12 = OverDate.init({
  date: "2024-05-17",
  hour: 12,
}).date;
export const saturday19At16 = OverDate.init({
  date: "2024-05-19",
  hour: 16,
}).date;
export const sunday19At10 = OverDate.init({
  date: "2024-05-19",
  hour: 10,
}).date;

export const karnaBorrow: Borrow = {
  id: 1,
  lender: "KARNA",
  availableOn: friday17At12,
  unavailableOn: sunday19At10,
  gears: [table],
};
