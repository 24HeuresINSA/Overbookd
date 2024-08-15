import { AssignmentIdentifier } from "@overbookd/assignment";
import { AssignmentSummary, TaskCategorized } from "@overbookd/assignment";
import { Category } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/time";

export type AssignmentSummaryWithTask = AssignmentSummary &
  Omit<TaskCategorized, "id"> & {
    hasFriendsAssigned: boolean;
  };

export type DisplayableAssignment = AssignmentIdentifier &
  IProvidePeriod & {
    name: string;
  };

export type AssignmentStat = {
  category: Category;
  duration: number;
};

export type VolunteerWithAssignmentStats = {
  id: number;
  firstname: string;
  lastname: string;
  charisma: number;
  stats: AssignmentStat[];
};
