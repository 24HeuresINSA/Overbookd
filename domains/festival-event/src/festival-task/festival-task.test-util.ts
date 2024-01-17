import { VALIDATED } from "../common/status";
import { Contact, FestivalActivity, FestivalTask } from "./festival-task";
import { TimeWindow } from "../common/time-window";
import { InquiryRequest } from "../common/inquiry-request";
import { FestivalTaskKeyEvents } from "./festival-task.event";
import { Location } from "../common/location";

export const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

export const noelContact: Contact = { ...noel, phone: "0601020304" };

export const lea = {
  id: 2,
  lastname: "Mouyno",
  firstname: "Lea",
};

export const leaContact: Contact = { ...lea, phone: "0602030405" };

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

export const friday11hfriday18hMobilization = {
  start: friday11hfriday18h.start,
  end: friday11hfriday18h.end,
  volunteers: [noel],
  teams: [{ count: 2, team: "bénévole" }],
  durationSplitInHour: null,
};

const saturday11hsaturday18h: TimeWindow = {
  start: new Date("2024-05-18T11:00+02:00"),
  end: new Date("2024-05-18T18:00+02:00"),
  id: "28600380-28600800",
};

export const saturday11hsaturday18hMobilization = {
  ...friday11hfriday18hMobilization,
  start: saturday11hsaturday18h.start,
  end: saturday11hsaturday18h.end,
};

const deuxTables: InquiryRequest = {
  name: "Table",
  slug: "table",
  quantity: 2,
};

export const humaGrass: Location = {
  id: 1,
  name: "Huma grass",
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
      volunteers: [],
      instruction: null,
    },
  },
  history: [FestivalTaskKeyEvents.created(noel)],
  feedbacks: [],
  mobilizations: [],
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
    appointment: humaGrass,
    contacts: [noelContact],
    global: null,
    inCharge: {
      volunteers: [lea],
      instruction: null,
    },
  },
  history: [FestivalTaskKeyEvents.created(noel)],
  feedbacks: [],
  mobilizations: [],
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
    contacts: [noelContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel],
      instruction: "Some instructions for in charge only",
    },
  },
  history: [FestivalTaskKeyEvents.created(noel)],
  feedbacks: [],
  mobilizations: [
    { ...saturday11hsaturday18hMobilization, id: saturday11hsaturday18h.id },
  ],
  gearInquiries: [],
};
