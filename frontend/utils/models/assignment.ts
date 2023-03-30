import { User } from "./user";

export const AssignmentModes = {
  ORGA_TASK: "orga-task",
  TASK_ORGA: "task-orga",
};

export interface Volunteer extends User {
  charisma: number;
  comment?: string;
  teams: string[];
}

export function getAssignmentModeFromRoute(url: string): string {
  return url.split("/").at(-1) ?? "";
}
