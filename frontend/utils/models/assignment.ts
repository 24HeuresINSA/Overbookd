import { User } from "./user";

export const AssignmentModes = {
  ORGA_TASK: "orga-task",
  TASK_ORGA: "task-orga",
};

export type AssignmentMode = keyof typeof AssignmentModes;

export interface Volunteer extends User {
  charisma: number;
  comment?: string;
  teams: string[];
}
