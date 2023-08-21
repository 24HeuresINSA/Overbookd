const UNDERLYING_TEAMS = ["hard", "confiance", "soft"];

function findUnderlyingTeamIndex(teamCode: string) {
  return UNDERLYING_TEAMS.indexOf(teamCode);
}

export function getUnderlyingTeams(teamCodes: string[]): string[] {
  const teamIndexes = teamCodes.map(findUnderlyingTeamIndex);
  const lessImportantTeamIndex = Math.max(...teamIndexes);
  if (lessImportantTeamIndex === -1) return [];
  return UNDERLYING_TEAMS.slice(lessImportantTeamIndex + 1);
}

export function getOtherAssignableTeams(requestedTeamCode: string): string[] {
  const teamIndex = findUnderlyingTeamIndex(requestedTeamCode);
  if (teamIndex === -1) return [];
  return UNDERLYING_TEAMS.slice(0, teamIndex);
}
