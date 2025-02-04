import { BACKLINE, MAGASIN } from "../common/inquiry-request.js";
import { APPROVED, REJECTED } from "../common/action.js";
import { REVIEWING, WILL_NOT_REVIEW } from "../common/review.js";
import {
  escapeGame,
  humaGrass,
  noelContact,
  lea,
  sacPoubelle,
  noel,
  saturday11hsaturday18hMobilization,
  friday18hsaturday10hMobilization,
  saturday08hsaturday11hMobilization,
  deuxTables,
  mdeHall,
  justDanceInstallerContact,
  justDanceInstallerBisContact,
  justDanceInstaller,
  justDanceInstallerBis,
  MobilizationBuilder,
  friday10h,
  friday11h,
  saturday10h,
  saturday11h,
  justDanceGuardContact,
  saturday18h,
  chaise,
  george,
  friday18h,
  saturday19h,
  saturday20h,
  barbecue,
  friday9h,
  troisMarteaux,
  justDance,
  preventionVillage,
  securityAccess,
  monday00h,
  barManege,
  saturday04h,
  sunday04h,
  pressConference,
  sunday12h,
  valery,
  sunday11h,
  sunday18h,
  sunday14h,
  saturday08h,
  saturday12h,
  gab,
  saturday09h,
} from "./festival-task.test-util.js";
import {
  InReviewWithConflicts,
  ValidatedWithConflicts,
  getFactory,
} from "./festival-task.factory.js";

const factory = getFactory();

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
          conflicts: { tasks: [], availability: true, assignments: [] },
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
          conflicts: { tasks: [], availability: true, assignments: [] },
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
    MobilizationBuilder.init<InReviewWithConflicts>({
      start: saturday11h,
      end: saturday18h,
      volunteers: [],
      teams: [
        { count: 2, team: "bénévole" },
        { count: 1, team: "confiance" },
      ],
    }).mobilization,
  ])
  .withInquiries([{ ...chaise, quantity: 2 }])
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
    MobilizationBuilder.init<InReviewWithConflicts>({
      start: friday11h,
      end: friday18h,
      volunteers: [],
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
    MobilizationBuilder.init<InReviewWithConflicts>({
      start: saturday19h,
      end: saturday20h,
      volunteers: [
        {
          ...noel,
          conflicts: { tasks: [], availability: true, assignments: [] },
        },
        {
          ...george,
          conflicts: { tasks: [], availability: true, assignments: [] },
        },
      ],
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
    MobilizationBuilder.init<InReviewWithConflicts>({
      start: saturday18h,
      end: saturday20h,
      volunteers: [
        {
          ...george,
          conflicts: { tasks: [], availability: true, assignments: [] },
        },
      ],
      teams: [],
    }).mobilization,
  ])
  .build();

export const flashMobOnJustDance = factory
  .refused("Flash Mob on Just Dance")
  .withFestivalActivity(justDance)
  .withReviews({ humain: REJECTED, elec: REJECTED })
  .build();

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

export const uninstallPreventionVillage = factory
  .inReview("Install Prevention Village")
  .withFestivalActivity(preventionVillage)
  .build();

export const flashMobOnPreventionVillage = factory
  .refused("Flash Mob on Prevention Village")
  .withFestivalActivity(preventionVillage)
  .withReviews({ humain: REJECTED })
  .build();

export const ignoredByMatos = factory
  .inReview("Ignored by matos")
  .withFestivalActivity(preventionVillage)
  .withReviews({ matos: WILL_NOT_REVIEW })
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

export const installBarbecue = factory
  .refused("Install Barbecue")
  .withFestivalActivity(barbecue)
  .withInquiries([{ ...chaise, quantity: 2 }])
  .withMobilizations([
    MobilizationBuilder.init<InReviewWithConflicts>({
      start: friday10h,
      end: friday11h,
      volunteers: [
        {
          ...george,
          conflicts: { tasks: [], availability: false, assignments: [] },
        },
      ],
      teams: [],
    }).mobilization,
    MobilizationBuilder.init<InReviewWithConflicts>({
      start: friday10h,
      end: friday18h,
      volunteers: [],
      teams: [{ count: 20, team: "vieux" }],
    }).mobilization,
  ])
  .withReviews({
    humain: REJECTED,
    matos: REJECTED,
    elec: REJECTED,
  })
  .build();
const friday09hFriday10hInReviewMobilization =
  MobilizationBuilder.init<InReviewWithConflicts>({
    start: friday9h,
    end: friday10h,
    volunteers: [],
    teams: [{ count: 5, team: "hard" }],
  }).mobilization;
const friday10hFriday18hInReviewMobilization =
  MobilizationBuilder.init<InReviewWithConflicts>({
    start: friday10h,
    end: friday18h,
    volunteers: [
      {
        ...george,
        conflicts: { tasks: [], availability: false, assignments: [] },
      },
      {
        ...lea,
        conflicts: { tasks: [], availability: false, assignments: [] },
      },
    ],
    teams: [
      { count: 2, team: "vieux" },
      { count: 5, team: "confiance" },
    ],
  }).mobilization;

export const uninstallBarbecue = factory
  .refused("Uninstall Barbecue")
  .withFestivalActivity(barbecue)
  .withMobilizations([friday10hFriday18hInReviewMobilization])
  .withReviews({
    humain: REJECTED,
    matos: REJECTED,
    elec: REJECTED,
  })
  .build();

export const onlyApprovedByMatos = factory
  .inReview("Approved by matos")
  .withReviews({ matos: APPROVED })
  .withInquiries([
    { ...deuxTables, drive: BACKLINE },
    { ...troisMarteaux, drive: MAGASIN },
  ])
  .withInstructions({
    contacts: [noelContact, justDanceInstallerContact],
    inCharge: {
      instruction: "Dedicated instruction",
      volunteers: [noel, george],
    },
  })
  .withMobilizations([friday10hFriday18hInReviewMobilization])
  .build();

export const onlyApprovedByHumain = factory
  .inReview("Approved by humain")
  .withInstructions({
    contacts: [noelContact, justDanceInstallerContact],
    inCharge: {
      instruction: "Dedicated instruction",
      volunteers: [noel, george],
    },
  })
  .withReviews({ humain: APPROVED })
  .withInquiries([{ ...deuxTables, drive: BACKLINE }])
  .withMobilizations([friday10hFriday18hInReviewMobilization])
  .build();

export const approvedByHumainAndMatos = factory
  .inReview("Approved by humain and matos")
  .withFestivalActivity(escapeGame)
  .withInstructions({
    contacts: [noelContact, justDanceInstallerContact],
    inCharge: {
      instruction: "Dedicated instruction",
      volunteers: [noel, george],
    },
  })
  .withReviews({ humain: APPROVED, matos: APPROVED })
  .withMobilizations([friday10hFriday18hInReviewMobilization])
  .build();

export const approvedByHumainRejectedByMatos = factory
  .refused("Approved by humain rejected by matos")
  .withInstructions({
    contacts: [noelContact, justDanceInstallerContact],
    inCharge: {
      instruction: "Dedicated instruction",
      volunteers: [noel, george],
    },
  })
  .withReviews({ humain: APPROVED, matos: REJECTED })
  .withInquiries([{ ...deuxTables, drive: BACKLINE }])
  .withMobilizations([
    friday10hFriday18hInReviewMobilization,
    friday09hFriday10hInReviewMobilization,
  ])
  .build();

export const approvedByHumainAndElecRejectedByMatos = factory
  .refused("Approved by humain and elec rejected by matos")
  .withFestivalActivity(escapeGame)
  .withInstructions({
    contacts: [noelContact, justDanceInstallerContact],
    inCharge: {
      instruction: "Dedicated instruction",
      volunteers: [noel, george],
    },
  })
  .withReviews({ humain: APPROVED, elec: APPROVED, matos: REJECTED })
  .withInquiries([{ ...deuxTables, drive: BACKLINE }])
  .withMobilizations([friday10hFriday18hInReviewMobilization])
  .build();

export const rejectedByElec = factory
  .refused("Rejected by elec")
  .withFestivalActivity(escapeGame)
  .withInstructions({
    contacts: [noelContact, justDanceInstallerContact],
    inCharge: {
      instruction: "Dedicated instruction",
      volunteers: [noel, george],
    },
  })
  .withReviews({ elec: REJECTED, humain: REVIEWING, matos: REVIEWING })
  .withMobilizations([friday10hFriday18hInReviewMobilization])
  .build();

export const approvedByElecRejectedByMatos = factory
  .refused("Approved by elec rejected by matos")
  .withFestivalActivity(escapeGame)
  .withInstructions({
    contacts: [noelContact, justDanceInstallerContact],
    inCharge: {
      instruction: null,
      volunteers: [],
    },
  })
  .withReviews({ humain: REVIEWING, elec: APPROVED, matos: REJECTED })
  .withInquiries([{ ...deuxTables, drive: BACKLINE }])
  .withMobilizations([friday10hFriday18hInReviewMobilization])
  .build();

export const approvedByMatosRejectedByHumainAndElec = factory
  .refused("Approved by matos rejected by humain and elec")
  .withFestivalActivity(escapeGame)
  .withInstructions({
    contacts: [noelContact, justDanceInstallerContact],
    inCharge: {
      instruction: "Dedicated instruction",
      volunteers: [noel, george],
    },
  })
  .withReviews({ humain: REJECTED, elec: REJECTED, matos: APPROVED })
  .withInquiries([{ ...deuxTables, drive: BACKLINE }])
  .withMobilizations([friday10hFriday18hInReviewMobilization])
  .build();

export const guardPS1 = factory
  .validated("Guard PS1")
  .withFestivalActivity(securityAccess)
  .withMobilizations([
    MobilizationBuilder.init<ValidatedWithConflicts>({
      start: friday18h,
      end: monday00h,
      durationSplitInHour: 2,
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
  ])
  .withInstructions({ global: "Guard PS1" })
  .build();

export const guardPS2 = factory
  .validated("Guard PS2")
  .withFestivalActivity(securityAccess)
  .withMobilizations([
    MobilizationBuilder.init<ValidatedWithConflicts>({
      start: friday18h,
      end: monday00h,
      durationSplitInHour: 2,
      teams: [{ count: 2, team: "bénévole" }],
    }).mobilization,
  ])
  .withInstructions({ global: "Guard PS2" })
  .build();

export const barCashier = factory
  .validated("Bar cashier")
  .withFestivalActivity(barManege)
  .withMobilizations([
    MobilizationBuilder.init<ValidatedWithConflicts>({
      start: friday18h,
      end: saturday04h,
      durationSplitInHour: 2,
      teams: [{ count: 1, team: "confiance" }],
    }).mobilization,
    MobilizationBuilder.init<ValidatedWithConflicts>({
      start: saturday18h,
      end: sunday04h,
      durationSplitInHour: 2,
      teams: [{ count: 1, team: "confiance" }],
    }).mobilization,
  ])
  .build();

export const leadPressConference = factory
  .validated("Lead press conference")
  .withFestivalActivity(pressConference)
  .withMobilizations([
    MobilizationBuilder.init<ValidatedWithConflicts>({
      start: sunday12h,
      end: sunday14h,
      volunteers: [
        {
          ...valery,
          conflicts: { availability: true, tasks: [], assignments: [] },
        },
      ],
    }).mobilization,
  ])
  .build();

export const preparePressConference = factory
  .validated("Prepare press conference")
  .withFestivalActivity(pressConference)
  .withMobilizations([
    MobilizationBuilder.init<ValidatedWithConflicts>({
      start: sunday11h,
      end: sunday12h,
      volunteers: [
        {
          ...valery,
          conflicts: { tasks: [], availability: false, assignments: [] },
        },
      ],
    }).mobilization,
  ])
  .build();

export const cleanPressConference = factory
  .validated("Clean press conference")
  .withFestivalActivity(pressConference)
  .withMobilizations([
    MobilizationBuilder.init<ValidatedWithConflicts>({
      start: sunday14h,
      end: sunday18h,
      volunteers: [
        {
          ...valery,
          conflicts: { tasks: [], availability: false, assignments: [] },
        },
      ],
      teams: [{ count: 3, team: "bénévole" }],
      durationSplitInHour: 2,
    }).mobilization,
  ])
  .build();

export const gabIsAssignedTo = factory
  .readyToAssign("Drive to the moon")
  .withMobilizations([
    MobilizationBuilder.init<ValidatedWithConflicts>({
      start: saturday08h,
      end: saturday12h,
      teams: [
        { count: 1, team: "conducteur" },
        { count: 3, team: "benevoles" },
      ],
      durationSplitInHour: 2,
    }).withAssignments([gab]).mobilization,
  ])
  .build();

export const findTruck = factory
  .validated("Find the truck")
  .withMobilizations([
    MobilizationBuilder.init<ValidatedWithConflicts>({
      start: saturday08h,
      end: saturday09h,
      volunteers: [
        {
          ...gab,
          conflicts: {
            tasks: [],
            availability: false,
            assignments: [
              { id: gabIsAssignedTo.id, name: gabIsAssignedTo.general.name },
            ],
          },
        },
      ],
    }).mobilization,
  ])
  .build();

export const parcoursCollageTrajetA = factory
  .readyToAssign("Parcours collage trajet A")
  .withMobilizations([
    MobilizationBuilder.init<ValidatedWithConflicts>({
      start: saturday08h,
      end: saturday12h,
      teams: [
        { count: 1, team: "conducteur" },
        { count: 3, team: "benevoles" },
      ],
      durationSplitInHour: 2,
    }).withAssignments([]).mobilization,
  ])
  .withInstructions({
    inCharge: { volunteers: [valery, george], instruction: "Let's go" },
  })
  .build();
