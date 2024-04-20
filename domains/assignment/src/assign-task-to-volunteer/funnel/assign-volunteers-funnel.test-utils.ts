import { BENEVOLE_CODE } from "@overbookd/team";
import { Assignment } from "./assignments";
import { Period } from "@overbookd/period";

const friday08hTo10h = Period.init({
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T10:00+02:00"),
});
const friday06hTo18h = Period.init({
  start: new Date("2024-05-17T06:00+02:00"),
  end: new Date("2024-05-17T18:00+02:00"),
});

const nextThursday08hTo10h = Period.init({
  start: new Date("2024-05-23T08:00+02:00"),
  end: new Date("2024-05-23T10:00+02:00"),
});

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

const friday08hTo09h = {
  start: new Date("2024-17-05T08:00+02:00"),
  end: new Date("2024-17-05T09:00+02:00"),
};

export const noel = {
  volunteer: {
    id: 1,
    firstname: "Noel",
    lastname: "Ertsemud",
    teams: [BENEVOLE_CODE, "vieux"],
  },
  planning: [{ ...friday08hTo09h, task: "Accueillir INSA CVL" }],
};

export const lea = {
  volunteer: {
    id: 2,
    firstname: "Lea",
    lastname: "Mauyno",
    teams: [BENEVOLE_CODE, "vieux", "conducteur"],
  },
  planning: [],
};
