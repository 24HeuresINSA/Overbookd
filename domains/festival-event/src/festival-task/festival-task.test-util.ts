import { VALIDATED } from "../common/status";
import {
  Contact,
  FestivalActivity,
  FestivalTask,
  Mobilization,
  VolunteerWithConflicts,
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
  Pick<AddMobilization, "durationSplitInHour" | "teams">
> & {
  start?: BuildTimeWindow;
  end?: BuildTimeWindow;
  volunteers?: VolunteerWithConflicts[];
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

export const lea = {
  id: 2,
  lastname: "Mouyno",
  firstname: "Lea",
};

export const leaContact: Contact = { ...lea, phone: "0602030405" };

const george = {
  id: 3,
  lastname: "Ette",
  firstname: "George",
};

const georgeContact: Contact = { ...george, phone: "0600000001" };

const friday8h: BuildTimeWindow = {
  date: new Date("2024-05-17T08:00+02:00"),
  id: "28598760",
};
const friday10h: BuildTimeWindow = {
  date: new Date("2024-05-17T10:00+02:00"),
  id: "28598880",
};
const friday11h: BuildTimeWindow = {
  date: new Date("2024-05-17T11:00+02:00"),
  id: "28598940",
};
const friday12h: BuildTimeWindow = {
  date: new Date("2024-05-17T12:00+02:00"),
  id: "28599000",
};
const friday13h: BuildTimeWindow = {
  date: new Date("2024-05-17T13:00+02:00"),
  id: "28599060",
};
const friday16h: BuildTimeWindow = {
  date: new Date("2024-05-17T16:00+02:00"),
  id: "28599240",
};
const friday18h: BuildTimeWindow = {
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
const saturday13h: BuildTimeWindow = {
  date: new Date("2024-05-18T13:00+02:00"),
  id: "28600500",
};
const saturday16h: BuildTimeWindow = {
  date: new Date("2024-05-18T16:00+02:00"),
  id: "28600680",
};
const saturday18h: BuildTimeWindow = {
  date: new Date("2024-05-18T18:00+02:00"),
  id: "28600800",
};
export const saturday19h: BuildTimeWindow = {
  date: new Date("2024-05-18T19:00+02:00"),
  id: "28600860",
};

// const friday8hfriday13h = TimeWindowFactory.create(friday8h, friday13h);
const friday10hfriday19h = TimeWindowFactory.create(friday10h, friday19h);
// const friday12hfriday16h = TimeWindowFactory.create(friday12h, friday16h);
const friday11hfriday18h = TimeWindowFactory.create(friday11h, friday18h);
// const saturday8hsaturday13h = TimeWindowFactory.create(saturday8h, saturday13h);
const saturday10hsaturday19h = TimeWindowFactory.create(
  saturday10h,
  saturday19h,
);
// const saturday12hsaturday16h = TimeWindowFactory.create(
//   saturday12h,
//   saturday16h,
// );
const saturday11hsaturday18h = TimeWindowFactory.create(
  saturday11h,
  saturday18h,
);

export const friday11hfriday18hMobilization = MobilizationBuilder.init({
  start: friday11h,
  end: friday18h,
  volunteers: [{ ...noel, conflicts: [] }],
  teams: [{ count: 2, team: "bénévole" }],
});
export const saturday18hsaturday19hMobilization = MobilizationBuilder.init({
  start: saturday18h,
  end: saturday19h,
  volunteers: [{ ...lea, conflicts: [] }],
});
export const saturday08hsaturday11hMobilization = MobilizationBuilder.init({
  start: saturday8h,
  end: saturday11h,
  volunteers: [{ ...lea, conflicts: [] }],
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

const justDanceMobilization = MobilizationBuilder.init();

const deuxTables: InquiryRequest = {
  name: "Table",
  slug: "table",
  quantity: 2,
};

const uneEnceinte: InquiryRequest = {
  name: "Enceinte",
  slug: "enceinte",
  quantity: 1,
};

const unVideoProjecteur: InquiryRequest = {
  name: "Vidéo Projecteur",
  slug: "video-projecteur",
  quantity: 1,
};

export const humaGrass: Location = {
  id: 1,
  name: "Huma grass",
};

const hallMde: Location = {
  id: 2,
  name: "Hall MDE",
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
  location: humaGrass,
  status: VALIDATED,
  hasSupplyRequest: true,
  timeWindows: [friday11hfriday18h],
  inquiry: {
    timeWindows: [friday10hfriday19h],
    all: [deuxTables],
  },
};

const justDance: FestivalActivity = {
  id: 2,
  name: "Just Dance",
  location: hallMde,
  status: VALIDATED,
  hasSupplyRequest: true,
  timeWindows: [friday11hfriday18h, saturday11hsaturday18h],
  inquiry: {
    timeWindows: [friday10hfriday19h, saturday10hsaturday19h],
    all: [unVideoProjecteur, uneEnceinte],
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
  mobilizations: [
    friday18hsaturday10hMobilization.mobilization,
    saturday08hsaturday11hMobilization.mobilization,
  ],
  inquiries: [],
};

const justDanceTasks = {
  install: { id: 5, name: "Install Just Dance" },
  onboardCollaborator: { id: 6, name: "Onboard Just Dance Collaborator" },
  present: { id: 7, name: "Present Just Dance" },
};

const installJustDanceConflicts = [
  justDanceTasks.onboardCollaborator,
  justDanceTasks.present,
];
const onboardJustDanceCollaboratorConflicts = [
  justDanceTasks.install,
  justDanceTasks.present,
];
const presentJustDanceConflicts = [
  justDanceTasks.install,
  justDanceTasks.onboardCollaborator,
];

const installJustDanceFriday = justDanceMobilization
  .withStart(friday8h)
  .withEnd(friday13h)
  .withVolunteers([
    { ...noel, conflicts: installJustDanceConflicts },
    { ...george, conflicts: installJustDanceConflicts },
  ]);

const installJustDanceSaturday = justDanceMobilization
  .withStart(saturday8h)
  .withEnd(saturday13h)
  .withVolunteers([
    { ...noel, conflicts: installJustDanceConflicts },
    { ...george, conflicts: installJustDanceConflicts },
  ]);
export const installJustDance: FestivalTask = {
  id: justDanceTasks.install.id,
  status: "DRAFT",
  general: {
    name: justDanceTasks.install.name,
    administrator: george,
    team: "plaizir",
  },
  festivalActivity: justDance,
  instructions: {
    appointment: humaGrass,
    contacts: [noelContact, georgeContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel, george],
      instruction: "Some instructions for in charge only",
    },
  },
  history: [FestivalTaskKeyEvents.created(george)],
  feedbacks: [],
  mobilizations: [
    installJustDanceFriday.mobilization,
    installJustDanceSaturday.mobilization,
  ],
  inquiries: [],
};

const onboardJustDanceCollaboratorFriday = justDanceMobilization
  .withStart(friday12h)
  .withEnd(friday16h)
  .withVolunteers([
    { ...noel, conflicts: onboardJustDanceCollaboratorConflicts },
    { ...george, conflicts: onboardJustDanceCollaboratorConflicts },
  ]);

const onboardJustDanceCollaboratorSaturday = justDanceMobilization
  .withStart(saturday12h)
  .withEnd(saturday16h)
  .withVolunteers([
    { ...noel, conflicts: onboardJustDanceCollaboratorConflicts },
    { ...george, conflicts: onboardJustDanceCollaboratorConflicts },
  ]);
export const onboardJustDanceCollaborator: FestivalTask = {
  id: justDanceTasks.onboardCollaborator.id,
  status: "DRAFT",
  general: {
    name: justDanceTasks.onboardCollaborator.name,
    administrator: george,
    team: "plaizir",
  },
  festivalActivity: justDance,
  instructions: {
    appointment: humaGrass,
    contacts: [noelContact, georgeContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel, george],
      instruction: "Some instructions for in charge only",
    },
  },
  history: [FestivalTaskKeyEvents.created(george)],
  feedbacks: [],
  mobilizations: [
    onboardJustDanceCollaboratorFriday.mobilization,
    onboardJustDanceCollaboratorSaturday.mobilization,
  ],
  inquiries: [],
};

const presentJustDanceFriday = justDanceMobilization
  .withStart(friday11h)
  .withEnd(friday18h)
  .withVolunteers([
    { ...noel, conflicts: presentJustDanceConflicts },
    { ...george, conflicts: presentJustDanceConflicts },
  ]);

const presentJustDanceSaturday = justDanceMobilization
  .withStart(saturday11h)
  .withEnd(saturday18h)
  .withVolunteers([
    { ...noel, conflicts: presentJustDanceConflicts },
    { ...george, conflicts: presentJustDanceConflicts },
  ]);

export const presentJustDance: FestivalTask = {
  id: justDanceTasks.present.id,
  status: "DRAFT",
  general: {
    name: justDanceTasks.present.name,
    administrator: george,
    team: "plaizir",
  },
  festivalActivity: justDance,
  instructions: {
    appointment: humaGrass,
    contacts: [noelContact, georgeContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel, george],
      instruction: "Some instructions for in charge only",
    },
  },
  history: [FestivalTaskKeyEvents.created(george)],
  feedbacks: [],
  mobilizations: [
    presentJustDanceFriday.mobilization,
    presentJustDanceSaturday.mobilization,
  ],
  inquiries: [],
};

// 18      [
// 17
// 16  [
// 15
// 14
// 13    [
// 12  ]
// 11      ]
// 10
// 09
// 08    ]
