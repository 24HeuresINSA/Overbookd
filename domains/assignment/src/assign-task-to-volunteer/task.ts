import { AssignmentSummary, Assignment } from "./assignment";
import { TaskCategorized } from "../task";

export type TaskWithAssignmentsSummary = Omit<
  TaskCategorized,
  "topPriority"
> & {
  assignments: AssignmentSummary[];
};

export type Task = TaskCategorized & {
  assignments: Assignment[];
};

export type MissingAssignmentTask = TaskCategorized & {
  teams: string[];
};
