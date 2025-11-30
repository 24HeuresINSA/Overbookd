import { moveAtFirstIndex } from "@overbookd/list";
import {
  ADMIN,
  HARD,
  CA,
  SOFT,
  CONFIANCE,
} from "@overbookd/team-constants";

export function sortTeamsForAssignment(teams: string[]): string[] {
  let sortedTeams = teams.filter(
    (team) => team !== ADMIN && team !== CA,
  );

  const confianceIndex = getTeamIndex(sortedTeams, CONFIANCE);
  if (confianceIndex !== -1) {
    sortedTeams = moveAtFirstIndex(sortedTeams, confianceIndex);
  }

  const softIndex = getTeamIndex(sortedTeams, SOFT);
  if (softIndex !== -1) sortedTeams = moveAtFirstIndex(sortedTeams, softIndex);

  const hardIndex = getTeamIndex(sortedTeams, HARD);
  if (hardIndex !== -1) sortedTeams = moveAtFirstIndex(sortedTeams, hardIndex);

  return sortedTeams;
}

function getTeamIndex(teams: string[], team: string): number {
  return teams.findIndex((t) => t === team);
}
