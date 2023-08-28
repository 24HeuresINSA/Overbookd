import { moveAtFirstIndex } from "@overbookd/list";

export interface Team {
  id: number;
  code: string;
  name: string;
  color: string;
  icon: string;
}

export function sortTeamsForAssignment(teams: string[]): string[] {
  let sortedTeams = teams.filter((team) => team !== "admin" && team !== "orga");

  const confianceIndex = getTeamIndex(sortedTeams, "confiance");
  if (confianceIndex !== -1) {
    sortedTeams = moveAtFirstIndex(sortedTeams, confianceIndex);
  }

  const softIndex = getTeamIndex(sortedTeams, "soft");
  if (softIndex !== -1) sortedTeams = moveAtFirstIndex(sortedTeams, softIndex);

  const hardIndex = getTeamIndex(sortedTeams, "hard");
  if (hardIndex !== -1) sortedTeams = moveAtFirstIndex(sortedTeams, hardIndex);

  return sortedTeams;
}

function getTeamIndex(teams: string[], team: string): number {
  return teams.findIndex((t) => t === team);
}
