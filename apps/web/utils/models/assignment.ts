import { User } from "./user";

export const AssignmentModes = {
  ORGA_TASK: "orga-task",
  TASK_ORGA: "task-orga",
};

export interface Volunteer extends User {
  charisma: number;
  comment?: string;
  teams: string[];
  assignmentDuration: number;
  friendAvailable?: boolean;
  isRequestedOnSamePeriod?: boolean;
  hasFriendAssigned?: boolean;
}

export interface UpdateAssignedTeam {
  timeSpanId: number;
  assigneeId: number;
  team: string;
}

export function getAssignmentModeFromRoute(url: string): string {
  const mode = url.split("/").at(-1);
  return mode ?? AssignmentModes.ORGA_TASK;
}

export const Sort = {
  ASC: 1,
  NONE: 0,
  DESC: -1,
};

export function nextSortDirection(direction: number): number {
  if (direction === Sort.ASC) return Sort.DESC;
  if (direction === Sort.DESC) return Sort.NONE;
  return Sort.ASC;
}
