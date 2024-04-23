import { ONE_HOUR_IN_MS, QUARTER_IN_MS } from "@overbookd/period";
import {
  VolunteerWithAssignmentDuration,
  VolunteerWithAssignments,
  VolunteerWithFriendFilter,
} from "./assign-volunteer-to-task";
import { Period } from "@overbookd/period";
import { BENEVOLE_CODE } from "@overbookd/team";

const friday08hTo10h = Period.init({
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T10:00+02:00"),
});
const friday11hTo14h = Period.init({
  start: new Date("2024-05-17T11:00+02:00"),
  end: new Date("2024-05-17T14:00+02:00"),
});
const friday15h15To18h = Period.init({
  start: new Date("2024-05-17T15:15+02:00"),
  end: new Date("2024-05-17T18:00+02:00"),
});

export const noel: VolunteerWithFriendFilter = {
  id: 1,
  firstname: "Noel",
  lastname: "Ertsemud",
  charisma: 1000,
  teams: [BENEVOLE_CODE, "hard", "comsa"],
  hasAtLeastOneFriend: false,
};
export const lea: VolunteerWithFriendFilter = {
  id: 2,
  firstname: "Lea",
  lastname: "Mouyno",
  charisma: 0,
  teams: ["conducteur", "vieux"],
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
