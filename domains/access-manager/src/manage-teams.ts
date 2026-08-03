import { ADMIN } from "@overbookd/team-constants";

export const NON_MANAGEABLE_TEAMS = [ADMIN];

export function isTeamManageable(team: string): boolean {
  return !NON_MANAGEABLE_TEAMS.includes(team);
}
