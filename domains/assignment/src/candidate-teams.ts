import { CONFIANCE, HARD, VIEUX } from "@overbookd/team-constants";

export function retrieveImplicitTeams(teams: string[]): string[] {
  const areConfianceByDefault = [HARD, VIEUX];
  const isConfiance = teams.some((team) =>
    areConfianceByDefault.includes(team),
  );

  return isConfiance ? [...teams, CONFIANCE] : teams;
}

export function extendOneOfTeams(oneOfTeams: string[]): string[] {
  return oneOfTeams.includes(CONFIANCE)
    ? [...oneOfTeams, VIEUX, HARD]
    : oneOfTeams;
}
