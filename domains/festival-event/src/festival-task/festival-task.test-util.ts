import { VALIDATED } from "../common/status";
import { FestivalActivity } from "./festival-task";
import { Contact } from "./sections/instructions";
import { Mobilization, VolunteerWithConflicts } from "./sections/mobilizations";
import { TimeWindow } from "../common/time-window";
import { InquiryRequest } from "../common/inquiry-request";
import { Location } from "../common/location";
import { AddMobilization } from "./prepare/prepare";
import { VolunteerAvailabilities } from "./volunteer-conflicts";
import { getFactory } from "./festival-task.factory";
import {
  george,
  saturday11hToSaturday18h,
} from "../festival-activity/festival-activity.fake";

const factory = getFactory();

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

const justDanceInstaller = {
  id: 3,
  lastname: "Dance",
  firstname: "Just",
};

const justDanceGuard = {
  id: 4,
  lastname: "Dance",
  firstname: "Just",
};

const justDanceInstallerContact: Contact = {
  ...justDanceInstaller,
  phone: "0603040506",
};

const justDanceInstallerBis = {
  id: 4,
  lastname: "Dance Bis",
  firstname: "Just",
};

const justDanceInstallerBisContact: Contact = {
  ...justDanceInstallerBis,
  phone: "0604050607",
};

const justDanceGuardContact: Contact = {
  ...justDanceGuard,
  phone: "0605060708",
};

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
const saturday18h: BuildTimeWindow = {
  date: new Date("2024-05-18T18:00+02:00"),
  id: "28600800",
};
export const saturday19h: BuildTimeWindow = {
  date: new Date("2024-05-18T19:00+02:00"),
  id: "28600860",
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
const saturday10hsaturday19h = TimeWindowFactory.create(
  saturday10h,
  saturday19h,
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
  start: saturday8h,
  end: saturday11h,
  volunteers: [{ ...lea, conflicts: { tasks: [], availability: false } }],
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

export const deuxTables: InquiryRequest = {
  name: "Table",
  slug: "table",
  quantity: 2,
};

export const humaGrass: Location = {
  id: 1,
  name: "Huma grass",
};

const mdeHall: Location = {
  id: 2,
  name: "MDE Hall",
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

export const installEscapeGame = factory
  .draft("Install Escape Game")
  .withFestivalActivity(escapeGame)
  .build();

export const uninstallEscapeGame = factory
  .draft("Uninstall Escape Game")
  .withFestivalActivity(escapeGame)
  .withInstructions({
    appointment: humaGrass,
    contacts: [noelContact],
    inCharge: {
      volunteers: [lea],
      instruction: null,
    },
  })
  .withInquiries([{ ...sacPoubelle, quantity: 2 }])
  .build();

export const presentEscapeGame = factory
  .draft("Present Escape Game")
  .withGeneral({ team: "sport" })
  .withFestivalActivity(escapeGame)
  .withInstructions({
    contacts: [noelContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel],
      instruction: "Some instructions for in charge only",
    },
  })
  .withMobilizations([saturday11hsaturday18hMobilization.mobilization])
  .build();

export const guardEscapeGame = factory
  .draft("Guard Escape Game")
  .withGeneral({ team: "sports" })
  .withFestivalActivity(escapeGame)
  .withInstructions({
    contacts: [noelContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel],
      instruction: "Some instructions for in charge only",
    },
  })
  .withMobilizations([
    friday18hsaturday10hMobilization.mobilization,
    saturday08hsaturday11hMobilization.mobilization,
  ])
  .build();

const justDance: FestivalActivity = {
  id: 2,
  name: "Just Dance",
  location: humaGrass,
  status: VALIDATED,
  hasSupplyRequest: true,
  timeWindows: [friday11hfriday18h, saturday11hToSaturday18h],
  inquiry: {
    timeWindows: [friday10hfriday19h, saturday10hsaturday19h],
    all: [deuxTables],
  },
};

export const installJustDance = factory
  .draft("Install Just Dance")
  .withGeneral({ team: "plaizir" })
  .withFestivalActivity(justDance)
  .withInstructions({
    appointment: mdeHall,
    contacts: [justDanceInstallerContact, justDanceInstallerBisContact],
    global: "Install just dance",
    inCharge: {
      volunteers: [justDanceInstaller, justDanceInstallerBis],
      instruction: "Dedicated just dance installation",
    },
  })
  .withMobilizations([
    MobilizationBuilder.init({
      start: friday10h,
      end: friday11h,
      volunteers: [
        {
          ...justDanceInstaller,
          conflicts: { tasks: [], availability: false },
        },
      ],
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
    MobilizationBuilder.init({
      start: saturday10h,
      end: saturday11h,
      volunteers: [
        {
          ...justDanceInstallerBis,
          conflicts: { tasks: [], availability: false },
        },
      ],
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
  ])
  .build();

export const guardJustDance = factory
  .inReview("Guard Just Dance")
  .withGeneral({ team: "plaizir" })
  .withFestivalActivity(justDance)
  .withInstructions({
    appointment: mdeHall,
    contacts: [justDanceGuardContact],
    global: "Install just dance",
  })
  .withMobilizations([
    MobilizationBuilder.init({
      start: friday11h,
      end: friday18h,
      volunteers: [],
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
    MobilizationBuilder.init({
      start: saturday11h,
      end: saturday18h,
      volunteers: [],
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
  ])
  .build();

export const serveWaterOnJustDance = factory
  .inReview("Serve water during Just Dance")
  .withGeneral({ team: "plaizir" })
  .withFestivalActivity(justDance)
  .withInstructions({
    appointment: mdeHall,
    contacts: [justDanceGuardContact, noelContact],
    global: "Install just dance",
    inCharge: {
      volunteers: [noel, george],
      instruction: "Some dedicated instruction",
    },
  })
  .withMobilizations([
    MobilizationBuilder.init({
      start: friday11h,
      end: friday18h,
      volunteers: [],
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
    MobilizationBuilder.init({
      start: saturday11h,
      end: saturday18h,
      volunteers: [],
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
  ])
  .build();

const preventionVillage: FestivalActivity = {
  id: 3,
  name: "Prevention Village",
  location: humaGrass,
  status: VALIDATED,
  hasSupplyRequest: false,
  timeWindows: [friday11hfriday18h, saturday11hToSaturday18h],
  inquiry: {
    timeWindows: [friday10hfriday19h, saturday10hsaturday19h],
    all: [deuxTables],
  },
};

const twoVolunteersOnFriday10hToFriday11h = MobilizationBuilder.init({
  start: friday10h,
  end: friday11h,
  teams: [{ count: 2, team: "bénévole" }],
});

export const installPreventionVillage = factory
  .draft("Install Prevention Village")
  .withGeneral({ team: "dd" })
  .withFestivalActivity(preventionVillage)
  .withInstructions({
    appointment: humaGrass,
    contacts: [noelContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel],
      instruction: "Some instructions for in charge only",
    },
  })
  .withMobilizations([
    twoVolunteersOnFriday10hToFriday11h.mobilization,
    MobilizationBuilder.init({
      start: saturday10h,
      end: saturday11h,
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
  ])
  .build();

export const guardPreventionVillage = factory
  .draft("Guard Prevention Village")
  .withGeneral({ team: "dd" })
  .withFestivalActivity(preventionVillage)
  .withInstructions({
    appointment: humaGrass,
    contacts: [noelContact],
    global: "Some instructions for everyone",
  })
  .withMobilizations([
    MobilizationBuilder.init({
      start: friday11h,
      end: friday18h,
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
    MobilizationBuilder.init({
      start: saturday11h,
      end: saturday18h,
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
  ])
  .build();

export const withNoTeamTask = factory
  .draft("Task with NO TEAM")
  .withFestivalActivity(preventionVillage)
  .withInstructions({
    contacts: [noelContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel],
      instruction: "Some instructions for in charge only",
    },
  })
  .withMobilizations([twoVolunteersOnFriday10hToFriday11h.mobilization])
  .build();

export const withNoAppointmentTask = factory
  .draft("Task with NO APPOINTMENT")
  .withGeneral({ team: "test" })
  .withFestivalActivity(preventionVillage)
  .withInstructions({
    appointment: null,
    contacts: [noelContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel],
      instruction: "Some instructions for in charge only",
    },
  })
  .withMobilizations([twoVolunteersOnFriday10hToFriday11h.mobilization])
  .build();

export const withNoGlobalInstructionsTask = factory
  .draft("Task with NO GLOBAL INSTRUCTIONS")
  .withGeneral({ team: "test" })
  .withFestivalActivity(preventionVillage)
  .withInstructions({
    appointment: mdeHall,
    contacts: [noelContact],
    global: null,
    inCharge: {
      volunteers: [noel],
      instruction: "Some instructions for in charge only",
    },
  })
  .withMobilizations([twoVolunteersOnFriday10hToFriday11h.mobilization])
  .build();

export const withNotAnyContactTask = factory
  .draft("Task with NOT ANY CONTACT")
  .withGeneral({ team: "test" })
  .withFestivalActivity(preventionVillage)
  .withInstructions({
    appointment: mdeHall,
    contacts: [],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel],
      instruction: "Some instructions for in charge only",
    },
  })
  .withMobilizations([twoVolunteersOnFriday10hToFriday11h.mobilization])
  .build();

export const withInChargeVolunteerButWithNotInChargeInstruction = factory
  .draft("Task with IN CHARGE VOLUNTEER BUT NOT IN CHARGE INSTRUCTIONS")
  .withGeneral({ team: "test" })
  .withFestivalActivity(preventionVillage)
  .withInstructions({
    appointment: mdeHall,
    contacts: [noelContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel],
      instruction: null,
    },
  })
  .withMobilizations([twoVolunteersOnFriday10hToFriday11h.mobilization])
  .build();

export const withInChargeInstructionButWithNotInChargeVolunteer = factory
  .draft("Task with IN CHARGE INSTRUCTIONS BUT NOT IN CHARGE VOLUNTEER")
  .withGeneral({ team: "test" })
  .withFestivalActivity(preventionVillage)
  .withInstructions({
    appointment: mdeHall,
    contacts: [noelContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [],
      instruction: "Some instructions for in charge only",
    },
  })
  .withMobilizations([twoVolunteersOnFriday10hToFriday11h.mobilization])
  .build();

export const withoutAnyMobilization = factory
  .draft("Task with NOT ANY MOBILIZATION")
  .withGeneral({ team: "test" })
  .withFestivalActivity(preventionVillage)
  .withInstructions({
    appointment: mdeHall,
    contacts: [noelContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel],
      instruction: "Some instructions for in charge only",
    },
  })
  .withMobilizations([])
  .build();

export const withSomeMobilizationsWithoutRequest = factory
  .draft("Task with SOME MOBILIZATIONS WITHOUT REQUEST")
  .withGeneral({ team: "test" })
  .withFestivalActivity(preventionVillage)
  .withInstructions({
    appointment: mdeHall,
    contacts: [noelContact],
    global: "Some instructions for everyone",
    inCharge: {
      volunteers: [noel],
      instruction: "Some instructions for in charge only",
    },
  })
  .withMobilizations([
    twoVolunteersOnFriday10hToFriday11h.mobilization,
    MobilizationBuilder.init({ start: friday11h, end: friday18h }).mobilization,
  ])
  .build();
