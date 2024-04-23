import { Assignment } from "../common/assignment";
import { TaskCategorized } from "../common/task";

export type TaskAssignment = Assignment & Omit<TaskCategorized, "id">;

export type TaskAssignmentForVolunteer = TaskAssignment & {
  hasFriendsAssigned: false;
};
