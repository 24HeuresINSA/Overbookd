import { OverDate } from "@overbookd/time";

export const chaise = {
  slug: "chaise",
  name: "Chaise",
};
export const table = {
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
