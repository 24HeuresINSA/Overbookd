import { Assignment } from "../common/assignment";
import { TaskCategorized } from "../task";

export type TaskAssignment = Assignment & Omit<TaskCategorized, "id">;
