import { Assignee, isMemberOf } from "./assign-task-to-volunteer/assignment";

export function countAssigneesInTeam(
  team: string,
  assignees: Assignee[],
): number {
  return assignees.filter(isMemberOf(team)).length;
}
