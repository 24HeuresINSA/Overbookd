import { AssignmentSummary, TaskCategorized } from "@overbookd/assignment";

export type AssignmentSummaryWithTask = AssignmentSummary &
  Omit<TaskCategorized, "id"> & {
    hasFriendsAssigned: boolean;
  };
