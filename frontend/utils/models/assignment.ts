import { User } from "./user";

export const AssignmentModes = {
  ORGA_TASK: "orga-task",
  TASK_ORGA: "task-orga",
};

export interface Volunteer extends User {
  charisma: number;
  comment?: string;
  teams: string[];
  assignments: number;
  friendAvailable?: boolean;
  isRequestedOnSamePeriod?: boolean;
  hasFriendAssigned?: boolean;
}

export function getAssignmentModeFromRoute(url: string): string {
  const mode = url.split("/").at(-1);
  return mode ?? AssignmentModes.ORGA_TASK;
}
