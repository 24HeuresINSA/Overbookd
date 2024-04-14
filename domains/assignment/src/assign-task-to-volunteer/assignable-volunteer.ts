import { Period } from "@overbookd/period";
import { Volunteer, WithAssignments } from "../volunteer";

export type AssignableVolunteer = Volunteer & {
  assignmentDuration: number;
  isRequestedOnSamePeriod: boolean;
  hasFriendAvailable: boolean;
  hasFriendAssigned: boolean;
};

export type StoredAssignableVolunteer = Omit<
  AssignableVolunteer,
  "assignmentDuration" | "isRequestedOnSamePeriod"
> &
  WithAssignments & {
    requestedDuring: Period[];
  };
