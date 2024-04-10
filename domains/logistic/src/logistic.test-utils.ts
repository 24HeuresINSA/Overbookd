import { OverDate } from "@overbookd/period";

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
export const sunday20At10 = OverDate.init({
  date: "2024-05-20",
  hour: 10,
}).date;
export const monday21At10 = OverDate.init({
  date: "2024-05-21",
  hour: 10,
}).date;
