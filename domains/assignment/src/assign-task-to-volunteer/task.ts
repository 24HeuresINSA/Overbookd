import { Category } from "@overbookd/festival-event-constants";
import { AssignmentSummary, Assignment } from "./assignment";

export type TaskIdentifier = {
  id: number;
  name: string;
};

type TaskCategorized = TaskIdentifier & {
  topPriority: boolean;
  category?: Category;
};

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
