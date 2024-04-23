import { AssignmentSummary, Assignment } from "../common/assignment";
import { TaskCategorized } from "../common/task";

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
