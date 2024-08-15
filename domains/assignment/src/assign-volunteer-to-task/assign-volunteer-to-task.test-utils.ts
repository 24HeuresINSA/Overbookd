import { ONE_HOUR_IN_MS, QUARTER_IN_MS, Period } from "@overbookd/time";
import {
  VolunteerWithAssignmentDuration,
  VolunteerWithAssignments,
  VolunteerWithFriendFilter,
} from "./assign-volunteer-to-task.js";

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

const noel: VolunteerWithFriendFilter = {
  id: 1,
  firstname: "Noel",
  lastname: "Ertsemud",
  charisma: 1000,
  teams: ["hard", "comsa"],
  hasAtLeastOneFriend: false,
};
const lea: VolunteerWithFriendFilter = {
  id: 2,
  firstname: "Lea",
  lastname: "Mouyno",
  charisma: 0,
  teams: ["vieux"],
  hasAtLeastOneFriend: false,
};

export const noelAssignee: VolunteerWithAssignments = {
  ...noel,
  assignments: [friday08hTo10h],
};
export const noelExpected: VolunteerWithAssignmentDuration = {
  ...noel,
  assignmentDuration: 2 * ONE_HOUR_IN_MS,
};

export const leaAssignee: VolunteerWithAssignments = {
  ...lea,
  assignments: [friday08hTo10h, friday11hTo14h, friday15h15To18h],
};
export const leaExpected: VolunteerWithAssignmentDuration = {
  ...lea,
  assignmentDuration: 7 * ONE_HOUR_IN_MS + 3 * QUARTER_IN_MS,
};
