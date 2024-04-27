import { AssignmentIdentifier } from "@overbookd/assignment";
import { AssignmentSummary, TaskCategorized } from "@overbookd/assignment";
import { Category } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/period";

export type AssignmentSummaryWithTask = AssignmentSummary &
  Omit<TaskCategorized, "id"> & {
    hasFriendsAssigned: boolean;
  };

export type DisplayableAssignment = AssignmentIdentifier &
  IProvidePeriod & {
    name: string;
  };

export type VolunteerAssignmentStat = {
  category: Category;
  duration: number;
};

export type AssignmentStats = {
  id: number;
  firstname: string;
  lastname: string;
  charisma: number;
  stats: VolunteerAssignmentStat[];
};
