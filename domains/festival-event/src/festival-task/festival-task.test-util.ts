import { Item } from "@overbookd/list";
import { FestivalActivity } from "./festival-task";
import { AddMobilization } from "./prepare/prepare";
import { Contact } from "./sections/instructions";
import { VolunteerWithConflicts } from "./sections/mobilizations";
import { VolunteerAvailabilities, WithConflicts } from "./volunteer-conflicts";
import { InquiryRequest } from "../common/inquiry-request";
import { Location } from "../common/location";
import { VALIDATED } from "../common/status";
import { TimeWindow } from "../common/time-window";

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
  Pick<AddMobilization, "durationSplitInHour" | "teams">
> & {
  start?: BuildTimeWindow;
  end?: BuildTimeWindow;
  volunteers?: VolunteerWithConflicts[];
};

export class MobilizationBuilder<T extends WithConflicts> {
  private constructor(readonly mobilization: Item<T["mobilizations"]>) {}

  static init<T extends WithConflicts>(
    initialisation?: InitMobilizationBuilder,
  ) {
    const start = initialisation?.start ?? friday11h;
    const end = initialisation?.end ?? friday18h;
    const durationSplitInHour = initialisation?.durationSplitInHour ?? null;
    const teams = initialisation?.teams ?? [];
    const volunteers = initialisation?.volunteers ?? [];

    const timeWindow = TimeWindowFactory.create(start, end);

    return new MobilizationBuilder<T>({
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

    return new MobilizationBuilder<T>({ ...this.mobilization, ...timeWindow });
  }

  withEnd(end: BuildTimeWindow) {
    const [startId] = this.mobilization.id.split("-");
    const start = { id: startId, date: this.mobilization.start };
    const timeWindow = TimeWindowFactory.create(start, end);

    return new MobilizationBuilder<T>({ ...this.mobilization, ...timeWindow });
  }

  withDurationSplit(
    durationSplitInHour: Item<T["mobilizations"]>["durationSplitInHour"],
  ) {
    return new MobilizationBuilder<T>({
      ...this.mobilization,
      durationSplitInHour,
    });
  }

  withTeams(teams: Item<T["mobilizations"]>["teams"]) {
    return new MobilizationBuilder<T>({ ...this.mobilization, teams });
  }

  withVolunteers(volunteers: Item<T["mobilizations"]>["volunteers"]) {
    return new MobilizationBuilder<T>({ ...this.mobilization, volunteers });
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

export const lea = {
  id: 2,
  lastname: "Mouyno",
  firstname: "Lea",
};

export const leaContact: Contact = { ...lea, phone: "0602030405" };

export const justDanceInstaller = {
  id: 3,
  lastname: "Dance",
  firstname: "Just",
};

const justDanceGuard = {
  id: 4,
  lastname: "Dance",
  firstname: "Just",
};

export const justDanceInstallerContact: Contact = {
  ...justDanceInstaller,
  phone: "0603040506",
};

export const justDanceInstallerBis = {
  id: 4,
  lastname: "Dance Bis",
  firstname: "Just",
};

export const justDanceInstallerBisContact: Contact = {
  ...justDanceInstallerBis,
  phone: "0604050607",
};

export const justDanceGuardContact: Contact = {
  ...justDanceGuard,
  phone: "0605060708",
};

export const george = {
  id: 5,
  lastname: "Ergo",
  firstname: "George",
};

export const friday9h: BuildTimeWindow = {
  date: new Date("2024-05-17T09:00+02:00"),
  id: "28598820",
};
export const friday10h: BuildTimeWindow = {
  date: new Date("2024-05-17T10:00+02:00"),
  id: "28598880",
};
export const friday11h: BuildTimeWindow = {
  date: new Date("2024-05-17T11:00+02:00"),
  id: "28598940",
};
export const friday17h: BuildTimeWindow = {
  date: new Date("2024-05-17T17:00+02:00"),
  id: "28599300",
};
export const friday18h: BuildTimeWindow = {
  date: new Date("2024-05-17T18:00+02:00"),
  id: "28599360",
};
export const friday19h: BuildTimeWindow = {
  date: new Date("2024-05-17T19:00+02:00"),
  id: "28599420",
};
export const saturday7h: BuildTimeWindow = {
  date: new Date("2024-05-18T07:00+02:00"),
  id: "28600140",
};
export const saturday8h: BuildTimeWindow = {
  date: new Date("2024-05-18T08:00+02:00"),
  id: "28600200",
};
export const saturday9h: BuildTimeWindow = {
  date: new Date("2024-05-18T09:00+02:00"),
  id: "28600260",
};
export const saturday10h: BuildTimeWindow = {
  date: new Date("2024-05-18T10:00+02:00"),
  id: "28600320",
};
export const saturday11h: BuildTimeWindow = {
  date: new Date("2024-05-18T11:00+02:00"),
  id: "28600380",
};
export const saturday12h: BuildTimeWindow = {
  date: new Date("2024-05-18T12:00+02:00"),
  id: "28600440",
};
export const saturday18h: BuildTimeWindow = {
  date: new Date("2024-05-18T18:00+02:00"),
  id: "28600800",
};
export const saturday19h: BuildTimeWindow = {
  date: new Date("2024-05-18T19:00+02:00"),
  id: "28600860",
};
export const saturday20h: BuildTimeWindow = {
  date: new Date("2024-05-18T20:00+02:00"),
  id: "28600920",
};
export const monday00h: BuildTimeWindow = {
  date: new Date("2024-05-20T00:00+02:00"),
  id: "28602600",
};
const monday01h: BuildTimeWindow = {
  date: new Date("2024-05-20T01:00+02:00"),
  id: "28602660",
};

export const noelAvailabilities: VolunteerAvailabilities = {
  volunteer: noel,
  availabilities: [{ start: friday10h.date, end: saturday19h.date }],
};
export const leaAvailabilities: VolunteerAvailabilities = {
  volunteer: lea,
  availabilities: [{ start: saturday8h.date, end: saturday11h.date }],
};

export const friday10hfriday19h = TimeWindowFactory.create(
  friday10h,
  friday19h,
);
export const friday11hfriday18h = TimeWindowFactory.create(
  friday11h,
  friday18h,
);
const saturday11hsaturday18h = TimeWindowFactory.create(
  saturday11h,
  saturday18h,
);
export const saturday10hsaturday19h = TimeWindowFactory.create(
  saturday10h,
  saturday19h,
);
const friday18hmonday00h = TimeWindowFactory.create(friday18h, monday00h);
const friday17hmonday01h = TimeWindowFactory.create(friday17h, monday01h);

export const friday11hfriday18hMobilization = MobilizationBuilder.init({
  start: friday11h,
  end: friday18h,
  volunteers: [{ ...noel, conflicts: { tasks: [], availability: false } }],
  teams: [{ count: 2, team: "bénévole" }],
});
export const saturday18hsaturday19hMobilization = MobilizationBuilder.init({
  start: saturday18h,
  end: saturday19h,
  volunteers: [{ ...noel, conflicts: { tasks: [], availability: false } }],
});
export const saturday08hsaturday11hMobilization = MobilizationBuilder.init({
  start: saturday8h,
  end: saturday11h,
  volunteers: [{ ...lea, conflicts: { tasks: [], availability: false } }],
});
export const friday10hfriday11hMobilization = MobilizationBuilder.init({
  start: friday10h,
  end: friday11h,
  teams: [{ count: 5, team: "bénévole" }],
});
export const friday10hfriday18hMobilization = MobilizationBuilder.init({
  start: friday10h,
  end: friday18h,
  teams: [{ count: 5, team: "hard" }],
});
export const friday18hsaturday10hMobilization = MobilizationBuilder.init({
  start: friday18h,
  end: saturday10h,
  durationSplitInHour: 2,
});
export const saturday11hsaturday18hMobilization = friday11hfriday18hMobilization
  .withStart(saturday11h)
  .withEnd(saturday18h);

const trenteGilletsJaune: InquiryRequest = {
  name: "Gillet Jaune",
  slug: "gillet-jaune",
  quantity: 30,
};

export const deuxTables: InquiryRequest = {
  name: "Table",
  slug: "table",
  quantity: 2,
};

export const troisMarteaux: InquiryRequest = {
  name: "Marteau",
  slug: "marteau",
  quantity: 3,
};

export const humaGrass: Location = {
  id: 1,
  name: "Huma grass",
};

export const mdeHall: Location = {
  id: 2,
  name: "MDE Hall",
};

const noDedicated: Location = {
  id: 3,
  name: "No Dedicated Location",
};

export const ficelle = {
  slug: "ficelle-en-metre",
  name: "ficelle (en metre)",
};

export const sacPoubelle = {
  slug: "sac-poubelle-rouleau",
  name: "Sac Poubelle (rouleau)",
};

export const chaise = {
  slug: "chaise",
  name: "Chaise",
};

export const escapeGame: FestivalActivity = {
  id: 1,
  name: "Escape game",
  location: humaGrass,
  status: VALIDATED,
  hasSupplyRequest: true,
  timeWindows: [friday11hfriday18h],
  inquiry: {
    timeWindows: [friday10hfriday19h],
    all: [deuxTables],
  },
};

export const barbecue: FestivalActivity = {
  id: 1,
  name: "Barbecue",
  location: humaGrass,
  status: VALIDATED,
  hasSupplyRequest: true,
  timeWindows: [friday11hfriday18h],
  inquiry: {
    timeWindows: [friday10hfriday19h],
    all: [deuxTables],
  },
};

export const justDance: FestivalActivity = {
  id: 2,
  name: "Just Dance",
  location: humaGrass,
  status: VALIDATED,
  hasSupplyRequest: true,
  timeWindows: [friday11hfriday18h, saturday11hsaturday18h],
  inquiry: {
    timeWindows: [friday10hfriday19h, saturday10hsaturday19h],
    all: [deuxTables],
  },
};

export const preventionVillage: FestivalActivity = {
  id: 3,
  name: "Prevention Village",
  location: humaGrass,
  status: VALIDATED,
  hasSupplyRequest: false,
  timeWindows: [friday11hfriday18h, saturday11hsaturday18h],
  inquiry: {
    timeWindows: [friday10hfriday19h, saturday10hsaturday19h],
    all: [deuxTables],
  },
};

export const securityAccess: FestivalActivity = {
  id: 4,
  name: "Security Access",
  location: noDedicated,
  status: VALIDATED,
  hasSupplyRequest: false,
  timeWindows: [friday18hmonday00h],
  inquiry: {
    timeWindows: [friday17hmonday01h],
    all: [trenteGilletsJaune],
  },
};
