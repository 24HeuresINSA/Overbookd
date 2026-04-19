import type {
  AssignmentIdentifier,
  TaskCategorizedWithMaybeFriendsAssigned,
  AssignmentSummary,
} from "@overbookd/assignment";
import type { Category } from "@overbookd/festival-event-constants";
import type { IProvidePeriod } from "@overbookd/time";

export type AssignmentSummaryWithTask = AssignmentSummary &
  Omit<TaskCategorizedWithMaybeFriendsAssigned, "id">;

export type DisplayableAssignment = AssignmentIdentifier &
  IProvidePeriod & {
    name: string;
  };

export type AssignmentStat = {
  category: Category;
  duration: number;
};

export type AssignmentStats = {
  stats: AssignmentStat[];
  withFriendsAssignmentDuration: number;
  friendsCount: number;
};

export type VolunteerWithAssignmentStats = {
  id: number;
  firstname: string;
  lastname: string;
  charisma: number;
} & AssignmentStats;
