import {
  AssignableVolunteer,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";

export type AssignmentVolunteer =
  | VolunteerWithAssignmentDuration
  | AssignableVolunteer;

export function isAssignableVolunteer(
  volunteer: AssignmentVolunteer,
): volunteer is AssignableVolunteer {
  return (
    Object.hasOwn(volunteer, "isRequestedOnSamePeriod") &&
    Object.hasOwn(volunteer, "hasFriendAvailable") &&
    Object.hasOwn(volunteer, "hasFriendAssigned")
  );
}
