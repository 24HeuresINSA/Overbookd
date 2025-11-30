import { CONFIANCE, HARD, VIEUX } from "@overbookd/team-constants";

export function extendOneOfTeams(oneOfTeams: string[]): string[] {
  return oneOfTeams.includes(CONFIANCE)
    ? [...oneOfTeams, VIEUX, HARD]
    : oneOfTeams;
}
