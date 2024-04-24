import { CONFIANCE, HARD, VIEUX } from "@overbookd/assignment";

export function extendOneOfTeams(oneOfTeams: string[]): string[] {
  return oneOfTeams.includes(CONFIANCE)
    ? [...new Set(...oneOfTeams, VIEUX, HARD)]
    : oneOfTeams;
}
