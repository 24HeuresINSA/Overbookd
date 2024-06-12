import { Assignee, isMemberOf } from "./assign-task-to-volunteer/assignment.js";

export function countAssigneesInTeam(
  team: string,
  assignees: Assignee[],
): number {
  return assignees.filter(isMemberOf(team)).length;
}
