import { CONFIANCE, HARD, VIEUX } from "@overbookd/assignment";

export function getUnderlyingTeams(teamCodes: string[]): string[] {
  const isAlreadyConfiance = teamCodes.includes(CONFIANCE);
  if (isAlreadyConfiance) return teamCodes;

  const shouldBeConfiance =
    teamCodes.includes(HARD) || teamCodes.includes(VIEUX);
  if (shouldBeConfiance) return [...teamCodes, CONFIANCE];

  return teamCodes;
}
