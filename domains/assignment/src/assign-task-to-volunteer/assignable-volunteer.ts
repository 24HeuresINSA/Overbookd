import { Period } from "@overbookd/period";
import { Volunteer } from "../volunteer";
import { IProvidePeriod } from "@overbookd/period";
import { Category } from "@overbookd/festival-event-constants";

export type AssignableVolunteer = Volunteer & {
  assignmentDuration: number;
  isRequestedOnSamePeriod: boolean;
  hasFriendAvailable: boolean;
  hasFriendAssigned: boolean;
  hasAtLeastOneFriend: boolean;
};

export type StoredAssignment = IProvidePeriod & { category: Category };

export type StoredAssignableVolunteer = Omit<
  AssignableVolunteer,
  "assignmentDuration" | "isRequestedOnSamePeriod"
> & {
  assignments: StoredAssignment[];
  requestedDuring: Period[];
};
