import { moveAtFirstIndex } from "@overbookd/list";
import {
  ADMIN_CODE,
  HARD_CODE,
  CA_CODE,
  SOFT_CODE,
  CONFIANCE_CODE,
} from "@overbookd/team-constants";

export function sortTeamsForAssignment(teams: string[]): string[] {
  let sortedTeams = teams.filter(
    (team) => team !== ADMIN_CODE && team !== CA_CODE,
  );

  const confianceIndex = getTeamIndex(sortedTeams, CONFIANCE_CODE);
  if (confianceIndex !== -1) {
    sortedTeams = moveAtFirstIndex(sortedTeams, confianceIndex);
  }

  const softIndex = getTeamIndex(sortedTeams, SOFT_CODE);
  if (softIndex !== -1) sortedTeams = moveAtFirstIndex(sortedTeams, softIndex);

  const hardIndex = getTeamIndex(sortedTeams, HARD_CODE);
  if (hardIndex !== -1) sortedTeams = moveAtFirstIndex(sortedTeams, hardIndex);

  return sortedTeams;
}

function getTeamIndex(teams: string[], team: string): number {
  return teams.findIndex((t) => t === team);
}
