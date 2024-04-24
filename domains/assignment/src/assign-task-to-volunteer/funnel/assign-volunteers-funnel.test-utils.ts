import { BENEVOLE_CODE } from "@overbookd/team";
import { IProvidePeriod, Period } from "@overbookd/period";
import { friday19hto21h } from "../test-resources/assign-task-to-volunteer.test.utils";
import { CONFIANCE, HARD, VIEUX } from "../../teams";
import { Assignment } from "../assignment";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import { PlanningEvent } from "./planning";
import { AssignableVolunteer } from "../assignable-volunteer";

const friday06h = new Date("2024-05-17T06:00+02:00");
const saturday18h = new Date("2024-05-18T18:00+02:00");
const saturday20h = new Date("2024-05-18T20:00+02:00");
const sunday20h = new Date("2024-05-19T20:00+02:00");
const monday10h = new Date("2024-05-13T10:00+02:00");
const nextMonday18h = new Date("2024-05-20T18:00+02:00");
const nextTuesday02h = new Date("2024-05-21T02:00+02:00");
const nextTuesday18h = new Date("2024-05-21T18:00+02:00");
const nextTuesday20h = new Date("2024-05-21T20:00+02:00");
const nextWednesday02h = new Date("2024-05-22T02:00+02:00");
const nextWednesday18h = new Date("2024-05-22T18:00+02:00");
const nextThursday02h = new Date("2024-05-23T02:00+02:00");
const nextThursday10h = new Date("2024-05-23T20:00+02:00");

const friday08hTo09h = {
  start: new Date("2024-17-05T08:00+02:00"),
  end: new Date("2024-17-05T09:00+02:00"),
};
const friday08hTo10h = Period.init({
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T10:00+02:00"),
});
const friday06hTo18h = Period.init({
  start: friday06h,
  end: new Date("2024-05-17T18:00+02:00"),
});
const friday22hToSaturday00h = Period.init({
  start: new Date("2024-05-17T22:00+02:00"),
  end: new Date("2024-05-18T00:00+02:00"),
});

const saturday18hTo20h = Period.init({ start: saturday18h, end: saturday20h });

const nextTuesday18hTo20h = Period.init({
  start: nextTuesday18h,
  end: nextTuesday20h,
});

const nextThursday08hTo10h = Period.init({
  start: new Date("2024-05-23T08:00+02:00"),
  end: nextThursday10h,
});

type TestHelper = {
  volunteer: AssignableVolunteer;
  planning: PlanningEvent[];
  availabilities: IProvidePeriod[];
};

export const noel: TestHelper = {
  volunteer: {
    id: 1,
    firstname: "Noel",
    lastname: "Ertsemud",
    teams: [BENEVOLE_CODE, VIEUX],
    charisma: 120,
    assignmentDuration: 1_000_000,
    isRequestedOnSamePeriod: false,
    hasFriendAssigned: false,
    hasAtLeastOneFriend: false,
    assignableFriendsIds: [],
  },
  planning: [
    {
      ...friday08hTo09h,
      task: { name: "Accueillir INSA CVL", id: 200, status: READY_TO_ASSIGN },
    },
  ],
  availabilities: [
    { start: monday10h, end: sunday20h },
    { start: nextMonday18h, end: nextWednesday02h },
    { start: nextWednesday18h, end: nextThursday10h },
  ],
};

export const lea: TestHelper = {
  volunteer: {
    id: 2,
    firstname: "Lea",
    lastname: "Mauyno",
    teams: [BENEVOLE_CODE, VIEUX, "conducteur"],
    charisma: 120,
    assignmentDuration: 1_000_000,
    isRequestedOnSamePeriod: false,
    hasFriendAssigned: false,
    hasAtLeastOneFriend: false,
    assignableFriendsIds: [],
  },
  planning: [],
  availabilities: [{ start: friday06h, end: sunday20h }],
};

export const ontaine: TestHelper = {
  volunteer: {
    id: 3,
    firstname: "Ontaine",
    lastname: "Porin",
    teams: [BENEVOLE_CODE, "catering", "conducteur"],
    charisma: 120,
    assignmentDuration: 1_000_000,
    isRequestedOnSamePeriod: false,
    hasFriendAssigned: false,
    hasAtLeastOneFriend: false,
    assignableFriendsIds: [],
  },
  planning: [],
  availabilities: [
    { start: monday10h, end: nextTuesday02h },
    { start: nextTuesday18h, end: nextThursday10h },
  ],
};

export const tatouin: TestHelper = {
  volunteer: {
    id: 4,
    firstname: "Tatouin",
    lastname: "Jesoph",
    teams: [BENEVOLE_CODE, VIEUX, "conducteur"],
    charisma: 120,
    assignmentDuration: 1_000_000,
    isRequestedOnSamePeriod: false,
    hasFriendAssigned: false,
    hasAtLeastOneFriend: false,
    assignableFriendsIds: [],
  },
  planning: [],
  availabilities: [
    { start: nextMonday18h, end: nextTuesday02h },
    { start: nextTuesday18h, end: nextWednesday02h },
    { start: nextWednesday18h, end: nextThursday02h },
  ],
};

export const luce: TestHelper = {
  volunteer: {
    id: 5,
    firstname: "Luce",
    lastname: "Nehgahredanv",
    teams: [BENEVOLE_CODE, HARD],
    charisma: 120,
    assignmentDuration: 1_000_000,
    isRequestedOnSamePeriod: false,
    hasFriendAssigned: false,
    hasAtLeastOneFriend: false,
    assignableFriendsIds: [],
  },
  planning: [],
  availabilities: [{ start: monday10h, end: nextTuesday02h }],
};

export const nathan: TestHelper = {
  volunteer: {
    id: 6,
    firstname: "Nathan",
    lastname: "Trice",
    teams: [BENEVOLE_CODE, VIEUX, HARD],
    charisma: 120,
    assignmentDuration: 1_000_000,
    isRequestedOnSamePeriod: false,
    hasFriendAssigned: false,
    hasAtLeastOneFriend: false,
    assignableFriendsIds: [],
  },
  planning: [],
  availabilities: [{ start: monday10h, end: nextTuesday02h }],
};

export const benevolant: Assignment = {
  start: friday08hTo10h.start,
  end: friday08hTo10h.end,
  taskId: 1,
  mobilizationId: friday06hTo18h.id,
  assignmentId: friday08hTo10h.id,
  name: "Benevolant",
  demands: [{ team: BENEVOLE_CODE, demand: 1 }],
  assignees: [],
};

export const rendreKangoo: Assignment = {
  start: nextThursday08hTo10h.start,
  end: nextThursday08hTo10h.end,
  taskId: 2,
  mobilizationId: nextThursday08hTo10h.id,
  assignmentId: nextThursday08hTo10h.id,
  name: "Rendre les Kangoos",
  demands: [
    { team: "conducteur", demand: 1 },
    { team: BENEVOLE_CODE, demand: 2 },
  ],
  assignees: [],
};

export const couperDesCarottes: Assignment = {
  start: friday08hTo10h.start,
  end: friday08hTo10h.end,
  taskId: 3,
  mobilizationId: friday08hTo10h.id,
  assignmentId: friday08hTo10h.id,
  name: "Couper les carottes",
  demands: [
    { team: "catering", demand: 1 },
    { team: BENEVOLE_CODE, demand: 2 },
  ],
  assignees: [
    { id: lea.volunteer.id, as: BENEVOLE_CODE },
    { id: tatouin.volunteer.id, as: BENEVOLE_CODE },
  ],
};

export const gererLaCaisse: Assignment = {
  start: friday19hto21h.start,
  end: friday19hto21h.end,
  taskId: 4,
  mobilizationId: friday19hto21h.id,
  assignmentId: friday19hto21h.id,
  name: "Gerer la caisse",
  demands: [{ team: CONFIANCE, demand: 2 }],
  assignees: [{ id: lea.volunteer.id, as: CONFIANCE }],
};

export const scannerLesBillets: Assignment = {
  start: friday22hToSaturday00h.start,
  end: friday22hToSaturday00h.end,
  taskId: 5,
  mobilizationId: friday22hToSaturday00h.id,
  assignmentId: friday22hToSaturday00h.id,
  name: "Scanner les billets",
  demands: [
    { team: CONFIANCE, demand: 1 },
    { team: BENEVOLE_CODE, demand: 5 },
  ],
  assignees: [],
};

export const demonterLesJeuxGonflables: Assignment = {
  start: saturday18hTo20h.start,
  end: saturday18hTo20h.end,
  taskId: 6,
  mobilizationId: saturday18hTo20h.id,
  assignmentId: saturday18hTo20h.id,
  name: "Demonter les jeux gonflables",
  demands: [{ team: BENEVOLE_CODE, demand: 1 }],
  assignees: [{ id: luce.volunteer.id }],
};

export const nettoyerLeQgCatering: Assignment = {
  start: nextTuesday18hTo20h.start,
  end: nextTuesday18hTo20h.end,
  taskId: 7,
  mobilizationId: nextTuesday18hTo20h.id,
  assignmentId: nextTuesday18hTo20h.id,
  name: "Nettoyer le QG Catering",
  demands: [{ team: BENEVOLE_CODE, demand: 3 }],
  assignees: [],
};
