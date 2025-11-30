import { CONFIANCE, HARD, VIEUX } from "@overbookd/team-constants";

export function retrieveImplicitTeams(teams: string[]) {
  const areConfianceByDefault = [HARD, VIEUX];
  const isConfiance = teams.some((team) =>
    areConfianceByDefault.includes(team),
  );

  return isConfiance ? [...teams, CONFIANCE] : teams;
}
