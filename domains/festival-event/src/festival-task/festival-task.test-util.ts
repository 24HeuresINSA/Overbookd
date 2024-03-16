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

export const valery = {
  id: 6,
  lastname: "Gisc",
  firstname: "Valery",
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
const friday20h: BuildTimeWindow = {
  date: new Date("2024-05-17T20:00+02:00"),
  id: "28599480",
};
const friday22h: BuildTimeWindow = {
  date: new Date("2024-05-17T22:00+02:00"),
  id: "28599600",
};
const saturday00h: BuildTimeWindow = {
  date: new Date("2024-05-18T00:00+02:00"),
  id: "28599720",
};
const saturday02h: BuildTimeWindow = {
  date: new Date("2024-05-18T02:00+02:00"),
  id: "28599840",
};
export const saturday04h: BuildTimeWindow = {
  date: new Date("2024-05-18T04:00+02:00"),
  id: "28599960",
};
const saturday06h: BuildTimeWindow = {
  date: new Date("2024-05-18T06:00+02:00"),
  id: "28600080",
};
export const saturday07h: BuildTimeWindow = {
  date: new Date("2024-05-18T07:00+02:00"),
  id: "28600140",
};
export const saturday08h: BuildTimeWindow = {
  date: new Date("2024-05-18T08:00+02:00"),
  id: "28600200",
};
export const saturday09h: BuildTimeWindow = {
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
const saturday14h: BuildTimeWindow = {
  date: new Date("2024-05-18T14:00+02:00"),
  id: "28600560",
};
const saturday16h: BuildTimeWindow = {
  date: new Date("2024-05-18T16:00+02:00"),
  id: "28600680",
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
const saturday22h: BuildTimeWindow = {
  date: new Date("2024-05-18T22:00+02:00"),
  id: "28601040",
};
const sunday00h: BuildTimeWindow = {
  date: new Date("2024-05-19T00:00+02:00"),
  id: "28601160",
};
const sunday02h: BuildTimeWindow = {
  date: new Date("2024-05-19T02:00+02:00"),
  id: "28601280",
};
export const sunday04h: BuildTimeWindow = {
  date: new Date("2024-05-19T04:00+02:00"),
  id: "28601400",
};
const sunday06h: BuildTimeWindow = {
  date: new Date("2024-05-19T06:00+02:00"),
  id: "28601520",
};
const sunday08h: BuildTimeWindow = {
  date: new Date("2024-05-19T08:00+02:00"),
  id: "28601640",
};
const sunday10h: BuildTimeWindow = {
  date: new Date("2024-05-19T10:00+02:00"),
  id: "28601760",
};
export const sunday11h: BuildTimeWindow = {
  date: new Date("2024-05-19T11:00+02:00"),
  id: "28601820",
};
export const sunday12h: BuildTimeWindow = {
  date: new Date("2024-05-19T12:00+02:00"),
  id: "28601880",
};
export const sunday14h: BuildTimeWindow = {
  date: new Date("2024-05-19T14:00+02:00"),
  id: "28602000",
};
const sunday16h: BuildTimeWindow = {
  date: new Date("2024-05-19T16:00+02:00"),
  id: "28602120",
};
export const sunday18h: BuildTimeWindow = {
  date: new Date("2024-05-19T18:00+02:00"),
  id: "28602240",
};
const sunday20h: BuildTimeWindow = {
  date: new Date("2024-05-19T20:00+02:00"),
  id: "28602360",
};
const sunday22h: BuildTimeWindow = {
  date: new Date("2024-05-19T22:00+02:00"),
  id: "28602480",
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
  availabilities: [{ start: saturday08h.date, end: saturday11h.date }],
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
const saturday10hsaturday19h = TimeWindowFactory.create(
  saturday10h,
  saturday19h,
);
const friday18hmonday00h = TimeWindowFactory.create(friday18h, monday00h);
const friday17hmonday01h = TimeWindowFactory.create(friday17h, monday01h);
const friday18hsaturday04h = TimeWindowFactory.create(friday18h, saturday04h);
const saturday18hsunday04h = TimeWindowFactory.create(saturday18h, sunday04h);
const sunday12hsunday16h = TimeWindowFactory.create(sunday12h, sunday16h);
export const friday18hfriday20h = TimeWindowFactory.create(
  friday18h,
  friday20h,
);
export const friday20hfriday22h = TimeWindowFactory.create(
  friday20h,
  friday22h,
);
export const friday22hsaturday00h = TimeWindowFactory.create(
  friday22h,
  saturday00h,
);
export const saturday00hsaturday02h = TimeWindowFactory.create(
  saturday00h,
  saturday02h,
);
export const saturday02hsaturday04h = TimeWindowFactory.create(
  saturday02h,
  saturday04h,
);
export const saturday04hsaturday06h = TimeWindowFactory.create(
  saturday04h,
  saturday06h,
);
export const saturday06hsaturday08h = TimeWindowFactory.create(
  saturday06h,
  saturday08h,
);
export const saturday08hsaturday10h = TimeWindowFactory.create(
  saturday08h,
  saturday10h,
);
export const saturday10hsaturday12h = TimeWindowFactory.create(
  saturday10h,
  saturday12h,
);
export const saturday12hsaturday14h = TimeWindowFactory.create(
  saturday12h,
  saturday14h,
);
export const saturday14hsaturday16h = TimeWindowFactory.create(
  saturday14h,
  saturday16h,
);
export const saturday16hsaturday18h = TimeWindowFactory.create(
  saturday16h,
  saturday18h,
);
export const saturday18hsaturday20h = TimeWindowFactory.create(
  saturday18h,
  saturday20h,
);
export const saturday20hsaturday22h = TimeWindowFactory.create(
  saturday20h,
  saturday22h,
);
export const saturday22hsunday00h = TimeWindowFactory.create(
  saturday22h,
  sunday00h,
);
export const sunday00hsunday02h = TimeWindowFactory.create(
  sunday00h,
  sunday02h,
);
export const sunday02hsunday04h = TimeWindowFactory.create(
  sunday02h,
  sunday04h,
);
export const sunday04hsunday06h = TimeWindowFactory.create(
  sunday04h,
  sunday06h,
);
export const sunday06hsunday08h = TimeWindowFactory.create(
  sunday06h,
  sunday08h,
);
export const sunday08hsunday10h = TimeWindowFactory.create(
  sunday08h,
  sunday10h,
);
export const sunday10hsunday12h = TimeWindowFactory.create(
  sunday10h,
  sunday12h,
);
export const sunday11hsunday12h = TimeWindowFactory.create(
  sunday11h,
  sunday12h,
);
export const sunday12hsunday14h = TimeWindowFactory.create(
  sunday12h,
  sunday14h,
);
export const sunday14hsunday16h = TimeWindowFactory.create(
  sunday14h,
  sunday16h,
);
export const sunday16hsunday18h = TimeWindowFactory.create(
  sunday16h,
  sunday18h,
);
export const sunday18hsunday20h = TimeWindowFactory.create(
  sunday18h,
  sunday20h,
);
export const sunday20hsunday22h = TimeWindowFactory.create(
  sunday20h,
  sunday22h,
);
export const sunday22hmonday00h = TimeWindowFactory.create(
  sunday22h,
  monday00h,
);

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
  start: saturday08h,
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

const nextToManege: Location = {
  id: 4,
  name: "Next to manège",
};

const headOfInsa: Location = {
  id: 5,
  name: "Head of INSA",
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

export const barManege: FestivalActivity = {
  id: 5,
  name: "Bar Manège",
  location: nextToManege,
  status: VALIDATED,
  hasSupplyRequest: false,
  timeWindows: [friday18hsaturday04h, saturday18hsunday04h],
  inquiry: {
    timeWindows: [friday18hsaturday04h, saturday18hsunday04h],
    all: [deuxTables],
  },
};

export const pressConference: FestivalActivity = {
  id: 6,
  name: "Press conference",
  location: headOfInsa,
  status: VALIDATED,
  hasSupplyRequest: true,
  timeWindows: [sunday12hsunday16h],
  inquiry: {
    timeWindows: [],
    all: [],
  },
};
