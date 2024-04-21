import { User } from "@overbookd/user";

export type Volunteer = User & {
  charisma: number;
  comment?: string;
  teams: string[];
  assignmentDuration: number;
  friendAvailable?: boolean;
  isRequestedOnSamePeriod?: boolean;
  hasFriendAssigned?: boolean;
};

export type UpdateAssignedTeam = {
  timeSpanId: number;
  assigneeId: number;
  team: string;
};

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
