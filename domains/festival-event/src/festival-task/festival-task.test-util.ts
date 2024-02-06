import { VALIDATED } from "../common/status";
import {
  Contact,
  FestivalActivity,
  FestivalTask,
  Mobilization,
  VolunteerMobilization,
} from "./festival-task";
import { TimeWindow } from "../common/time-window";
import { InquiryRequest } from "../common/inquiry-request";
import { FestivalTaskKeyEvents } from "./festival-task.event";
import { Location } from "../common/location";
import { AddMobilization } from "./prepare/prepare";

type BuildTimeWindow = {
  date: Date;
  id: string;
};

class TimeWindowFactory {
  static create(start: BuildTimeWindow, end: BuildTimeWindow): TimeWindow {
    const id = `${start.id}-${end.id}`;
    return { start: start.date, end: end.date, id };
  }
}

type InitMobilizationBuilder = Partial<
  Pick<AddMobilization, "durationSplitInHour" | "teams" | "volunteers">
> & {
  start?: BuildTimeWindow;
  end?: BuildTimeWindow;
};

class MobilizationBuilder {
  private constructor(readonly mobilization: Mobilization) {}

  static init(initialisation?: InitMobilizationBuilder) {
    const start = initialisation?.start ?? friday11h;
    const end = initialisation?.end ?? friday18h;
    const durationSplitInHour = initialisation?.durationSplitInHour ?? null;
    const teams = initialisation?.teams ?? [];
    const volunteers = initialisation?.volunteers ?? [];

    const timeWindow = TimeWindowFactory.create(start, end);

    return new MobilizationBuilder({
      ...timeWindow,
      teams,
      volunteers,
      durationSplitInHour,
    });
  }

  withStart(start: BuildTimeWindow) {
    const [_startId, endId] = this.mobilization.id.split("-");
    const end = { id: endId, date: this.mobilization.end };
    const timeWindow = TimeWindowFactory.create(start, end);

    return new MobilizationBuilder({ ...this.mobilization, ...timeWindow });
  }

  withEnd(end: BuildTimeWindow) {
    const [startId] = this.mobilization.id.split("-");
    const start = { id: startId, date: this.mobilization.start };
    const timeWindow = TimeWindowFactory.create(start, end);

    return new MobilizationBuilder({ ...this.mobilization, ...timeWindow });
  }

  withDurationSplit(durationSplitInHour: Mobilization["durationSplitInHour"]) {
    return new MobilizationBuilder({
      ...this.mobilization,
      durationSplitInHour,
    });
  }

  withTeams(teams: Mobilization["teams"]) {
    return new MobilizationBuilder({ ...this.mobilization, teams });
  }

  withVolunteers(volunteers: Mobilization["volunteers"]) {
    return new MobilizationBuilder({ ...this.mobilization, volunteers });
  }

  get form(): AddMobilization {
    const { id, ...form } = this.mobilization;
    return form;
  }
}

export const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

export const noelContact: Contact = { ...noel, phone: "0601020304" };

export const noelMobilization: VolunteerMobilization = {
  ...noel,
  isAlreadyAssigned: false,
};

export const lea = {
  id: 2,
  lastname: "Mouyno",
  firstname: "Lea",
};

export const leaContact: Contact = { ...lea, phone: "0602030405" };

const friday10h: BuildTimeWindow = {
  date: new Date("2024-05-17T10:00+02:00"),
  id: "28598880",
};
const friday11h: BuildTimeWindow = {
  date: new Date("2024-05-17T11:00+02:00"),
  id: "28598940",
};
const friday18h: BuildTimeWindow = {
  date: new Date("2024-05-17T18:00+02:00"),
  id: "28599360",
};
export const friday19h: BuildTimeWindow = {
  date: new Date("2024-05-17T19:00+02:00"),
  id: "28599420",
};
export const saturday10h: BuildTimeWindow = {
  date: new Date("2024-05-18T10:00+02:00"),
  id: "28600320",
};
export const saturday11h: BuildTimeWindow = {
  date: new Date("2024-05-18T11:00+02:00"),
  id: "28600380",
};
const saturday18h: BuildTimeWindow = {
  date: new Date("2024-05-18T18:00+02:00"),
  id: "28600800",
};
export const saturday19h: BuildTimeWindow = {
  date: new Date("2024-05-18T19:00+02:00"),
  id: "28600860",
};

const friday10hfriday19h = TimeWindowFactory.create(friday10h, friday19h);
const friday11hfriday18h = TimeWindowFactory.create(friday11h, friday18h);

export const friday11hfriday18hMobilization = MobilizationBuilder.init({
  start: friday11h,
  end: friday18h,
  volunteers: [noelMobilization],
  teams: [{ count: 2, team: "bénévole" }],
});
export const friday18hsaturday10hMobilization = MobilizationBuilder.init({
  start: friday18h,
  end: saturday10h,
  durationSplitInHour: 2,
});
export const saturday11hsaturday18hMobilization = friday11hfriday18hMobilization
  .withStart(saturday11h)
  .withEnd(saturday18h);

const deuxTables: InquiryRequest = {
  name: "Table",
  slug: "table",
  quantity: 2,
};

export const humaGrass: Location = {
  id: 1,
  name: "Huma grass",
};

export const ficelle = {
  slug: "ficelle-en-metre",
  name: "ficelle (en metre)",
};

export const sacPoubelle = {
  slug: "sac-poubelle-rouleau",
  name: "Sac Poubelle (rouleau)",
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
  inquiries: [],
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
  inquiries: [{ ...sacPoubelle, quantity: 2 }],
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
  mobilizations: [saturday11hsaturday18hMobilization.mobilization],
  inquiries: [],
};

export const guardEscapeGame: FestivalTask = {
  id: 4,
  status: "DRAFT",
  general: {
    name: "Guard Escape Game",
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
  mobilizations: [friday18hsaturday10hMobilization.mobilization],
  inquiries: [],
};
