import { AssignmentIdentifier } from "@overbookd/assignment";
import { AssignmentSummary, TaskCategorized } from "@overbookd/assignment";
import { IProvidePeriod } from "@overbookd/period";

export type AssignmentSummaryWithTask = AssignmentSummary &
  Omit<TaskCategorized, "id"> & {
    hasFriendsAssigned: boolean;
  };

export type DisplayableAssignment = AssignmentIdentifier &
  IProvidePeriod & {
    name: string;
  };
