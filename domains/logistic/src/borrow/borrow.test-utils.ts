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

export const karnaBorrow: Borrow = {
  id: 1,
  lender: "KARNA",
  gearsToTake: [table],
  gearsToReturn: [table],
};
