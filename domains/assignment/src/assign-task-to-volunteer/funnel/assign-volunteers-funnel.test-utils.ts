import { BENEVOLE_CODE } from "@overbookd/team";
import { Assignment } from "./assignments";
import { Period } from "@overbookd/period";
import { friday19hto21h } from "../test-ressources/assign-task-to-volunteer.test.utils";
import { CONFIANCE, HARD, VIEUX } from "./teams";

const friday08hTo09h = {
  start: new Date("2024-17-05T08:00+02:00"),
  end: new Date("2024-17-05T09:00+02:00"),
};
const friday08hTo10h = Period.init({
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T10:00+02:00"),
});
const friday06hTo18h = Period.init({
  start: new Date("2024-05-17T06:00+02:00"),
  end: new Date("2024-05-17T18:00+02:00"),
});
const friday22hToSaturday00h = Period.init({
  start: new Date("2024-05-17T22:00+02:00"),
  end: new Date("2024-05-18T00:00+02:00"),
});

const nextThursday08hTo10h = Period.init({
  start: new Date("2024-05-23T08:00+02:00"),
  end: new Date("2024-05-23T10:00+02:00"),
});

export const noel = {
  volunteer: {
    id: 1,
    firstname: "Noel",
    lastname: "Ertsemud",
    teams: [BENEVOLE_CODE, VIEUX],
  },
  planning: [{ ...friday08hTo09h, task: "Accueillir INSA CVL" }],
};

export const lea = {
  volunteer: {
    id: 2,
    firstname: "Lea",
    lastname: "Mauyno",
    teams: [BENEVOLE_CODE, VIEUX, "conducteur"],
  },
  planning: [],
};

export const ontaine = {
  volunteer: {
    id: 3,
    firstname: "Ontaine",
    lastname: "Porin",
    teams: [BENEVOLE_CODE, "catering", "conducteur"],
  },
  planning: [],
};

export const tatouin = {
  volunteer: {
    id: 4,
    firstname: "Tatouin",
    lastname: "Jesoph",
    teams: [BENEVOLE_CODE, VIEUX, "conducteur"],
  },
  planning: [],
};

export const luce = {
  volunteer: {
    id: 5,
    firstname: "Luce",
    lastname: "Nehgahredanv",
    teams: [BENEVOLE_CODE, HARD],
  },
  planning: [],
};

export const benevolant: Assignment = {
  start: friday08hTo10h.start,
  end: friday08hTo10h.end,
  taskId: 1,
  mobilizationId: friday06hTo18h.id,
  assignmentId: friday08hTo10h.id,
  name: "Benevolant",
  demands: [{ team: BENEVOLE_CODE, count: 1 }],
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
    { team: "conducteur", count: 1 },
    { team: BENEVOLE_CODE, count: 2 },
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
    { team: "catering", count: 1 },
    { team: BENEVOLE_CODE, count: 2 },
  ],
  assignees: [
    { volunteer: lea.volunteer.id, as: BENEVOLE_CODE },
    { volunteer: tatouin.volunteer.id, as: BENEVOLE_CODE },
  ],
};

export const gererLaCaisse: Assignment = {
  start: friday19hto21h.start,
  end: friday19hto21h.end,
  taskId: 4,
  mobilizationId: friday19hto21h.id,
  assignmentId: friday19hto21h.id,
  name: "Gerer la caisse",
  demands: [{ team: CONFIANCE, count: 2 }],
  assignees: [{ volunteer: lea.volunteer.id, as: CONFIANCE }],
};

export const scannerLesBillets: Assignment = {
  start: friday22hToSaturday00h.start,
  end: friday22hToSaturday00h.end,
  taskId: 5,
  mobilizationId: friday22hToSaturday00h.id,
  assignmentId: friday22hToSaturday00h.id,
  name: "Scanner les billets",
  demands: [
    { team: CONFIANCE, count: 1 },
    { team: BENEVOLE_CODE, count: 5 },
  ],
  assignees: [],
};
