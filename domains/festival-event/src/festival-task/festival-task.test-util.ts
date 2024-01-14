import { VALIDATED } from "../common/status";
import { FestivalActivity, FestivalTask } from "./festival-task";
import { TimeWindow } from "../festival-activity/sections/time-window";
import { InquiryRequest } from "../common/inquiry-request";
import { FestivalTaskKeyEvents } from "./festival-task.event";

export const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

export const lea = {
  id: 2,
  lastname: "Mouyno",
  firstname: "Lea",
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

export const installEscapeGame: FestivalTask = {
  id: 1,
  status: "DRAFT",
  general: {
    name: "Install Escape Game",
    administrator: noel,
    team: null,
  },
  festivalActivity: escapeGame,
  instructions: {
    appointment: null,
    contacts: [],
    global: null,
    inCharge: {
      adherents: [],
      instruction: null,
    },
  },
  history: [FestivalTaskKeyEvents.created(noel)],
  feedbacks: [],
  volunteerInquiries: [],
  gearInquiries: [],
};

export const uninstallEscapeGame: FestivalTask = {
  id: 2,
  status: "DRAFT",
  general: {
    name: "Uninstall Escape Game",
    administrator: noel,
    team: null,
  },
  festivalActivity: escapeGame,
  instructions: {
    appointment: null,
    contacts: [],
    global: null,
    inCharge: {
      adherents: [],
      instruction: null,
    },
  },
  history: [FestivalTaskKeyEvents.created(noel)],
  feedbacks: [],
  volunteerInquiries: [],
  gearInquiries: [],
};

export const presentEscapeGame: FestivalTask = {
  id: 3,
  status: "DRAFT",
  general: {
    name: "Present Escape Game",
    administrator: noel,
    team: "sports",
  },
  festivalActivity: escapeGame,
  instructions: {
    appointment: null,
    contacts: [],
    global: null,
    inCharge: {
      adherents: [],
      instruction: null,
    },
  },
  history: [FestivalTaskKeyEvents.created(noel)],
  feedbacks: [],
  volunteerInquiries: [],
  gearInquiries: [],
};
