import { ONE_HOUR_IN_MS, QUARTER_IN_MS } from "@overbookd/period";
import {
  Assignee,
  AssigneeWithAssignmentDuration,
  AssigneeWithAssignments,
} from "./assignment-duration-assignee";
import { Period } from "@overbookd/period";

const friday08hTo10h = Period.init({
  start: new Date("2022-07-01T08:00:00Z"),
  end: new Date("2022-07-01T10:00:00Z"),
});
const friday11hTo14h = Period.init({
  start: new Date("2022-07-01T11:00:00Z"),
  end: new Date("2022-07-01T14:00:00Z"),
});
const friday15h15To18h = Period.init({
  start: new Date("2022-07-01T15:15:00Z"),
  end: new Date("2022-07-01T18:00:00Z"),
});

const noel: Assignee = {
  id: 1,
  firstname: "Noel",
  lastname: "Ertsemud",
  charisma: 1000,
  teams: ["hard", "comsa"],
};
const lea: Assignee = {
  id: 2,
  firstname: "Lea",
  lastname: "Mouyno",
  charisma: 0,
  teams: ["vieux"],
};

export const noelAssignee: AssigneeWithAssignments = {
  ...noel,
  assignments: [friday08hTo10h],
};
export const noelExpected: AssigneeWithAssignmentDuration = {
  ...noel,
  assignmentDuration: 2 * ONE_HOUR_IN_MS,
};

export const leaAssignee: AssigneeWithAssignments = {
  ...lea,
  assignments: [friday08hTo10h, friday11hTo14h, friday15h15To18h],
};
export const leaExpected: AssigneeWithAssignmentDuration = {
  ...lea,
  assignmentDuration: 7 * ONE_HOUR_IN_MS + 3 * QUARTER_IN_MS,
};
