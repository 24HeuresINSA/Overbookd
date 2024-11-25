import { moveAtFirstIndex } from "@overbookd/list";
import { BENEVOLE_FESTIVAL_CODE, HARD_CODE } from "@overbookd/team-constants";

export function sortTeamsForAssignment(teams: string[]): string[] {
  let sortedTeams = teams.filter((team) => team !== "admin" && team !== "orga");

  const confianceIndex = getTeamIndex(sortedTeams, "confiance");
  if (confianceIndex !== -1) {
    sortedTeams = moveAtFirstIndex(sortedTeams, confianceIndex);
  }

  const festivalVolunteerIndex = getTeamIndex(
    sortedTeams,
    BENEVOLE_FESTIVAL_CODE,
  );
  if (festivalVolunteerIndex !== -1)
    sortedTeams = moveAtFirstIndex(sortedTeams, festivalVolunteerIndex);

  const hardIndex = getTeamIndex(sortedTeams, HARD_CODE);
  if (hardIndex !== -1) sortedTeams = moveAtFirstIndex(sortedTeams, hardIndex);

  return sortedTeams;
}

function getTeamIndex(teams: string[], team: string): number {
  return teams.findIndex((t) => t === team);
}
