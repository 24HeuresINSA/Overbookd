import { Category } from "@overbookd/festival-event-constants";
import { AssignmentSummary, Assignment } from "./assignment.js";

export type TaskIdentifier = {
  id: number;
  name: string;
};

export type TaskCategorized = TaskIdentifier & {
  topPriority: boolean;
  category?: Category;
  inChargeTeam: string;
};

export type TaskWithAssignmentsSummary = Omit<
  TaskCategorized,
  "topPriority" | "inChargeTeam"
> & {
  assignments: AssignmentSummary[];
};

export type Task = TaskCategorized & {
  assignments: Assignment[];
};

export type TaskForAssignment = TaskCategorized & {
  teams: string[];
};
