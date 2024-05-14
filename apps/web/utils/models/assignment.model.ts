import { User } from "@overbookd/user";

/**
 * @deprecated Used in the old version of assignment
 */
export type Volunteer = User & {
  charisma: number;
  comment?: string;
  teams: string[];
  assignmentDuration: number;
  friendAvailable?: boolean;
  isRequestedOnSamePeriod?: boolean;
  hasFriendAssigned?: boolean;
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
