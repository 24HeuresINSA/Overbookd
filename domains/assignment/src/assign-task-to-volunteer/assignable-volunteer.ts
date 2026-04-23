import { Volunteer } from "../volunteer.js";
import { Period, IProvidePeriod } from "@overbookd/time";
import { Category } from "@overbookd/festival-event-constants";
import { FriendCount } from "../friends.js";

export type AssignableVolunteer = Volunteer & {
  totalAssignmentDuration: number;
  assignmentDuration: number;
  isRequestedOnSamePeriod: boolean;
  hasFriendAssigned: boolean;
  friendCount: FriendCount;
  assignableFriendsIds: number[];
};

export type StoredAssignment = IProvidePeriod & { category: Category };

export type StoredAssignableVolunteer = Omit<
  AssignableVolunteer,
  "assignmentDuration" | "isRequestedOnSamePeriod" | "totalAssignmentDuration"
> & {
  assignments: StoredAssignment[];
  requestedDuring: Period[];
};
