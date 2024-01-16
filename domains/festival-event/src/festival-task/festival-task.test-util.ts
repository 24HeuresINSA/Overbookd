import { VALIDATED } from "../common/status";
import { FestivalActivity } from "./festival-task";
import { TimeWindow } from "../festival-activity/sections/time-window";
import { InquiryRequest } from "../common/inquiry-request";

export const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

const friday10hfriday19h: TimeWindow = {
  start: new Date("2024-05-17T10:00+02:00"),
  end: new Date("2024-05-17T19:00+02:00"),
  id: "28598880-28599420",
};

const friday11hfriday18h: TimeWindow = {
  start: new Date("2024-05-17T11:00+02:00"),
  end: new Date("2024-05-17T18:00+02:00"),
  id: "28598940-28599360",
};

const deuxTables: InquiryRequest = {
  name: "Table",
  slug: "table",
  quantity: 2,
};

export const escapeGame: FestivalActivity = {
  id: 1,
  name: "Escape game",
  status: VALIDATED,
  timeWindows: [friday11hfriday18h],
  inquiry: {
    timeWindows: [friday10hfriday19h],
    all: [deuxTables],
  },
};
