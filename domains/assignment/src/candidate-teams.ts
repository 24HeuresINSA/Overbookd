import { CONFIANCE, HARD, VIEUX } from "./teams";

export function retrieveImplicitTeams(teams: string[]) {
  const areConfianceByDefault = [HARD, VIEUX];
  const isConfiance = teams.some((team) =>
    areConfianceByDefault.includes(team),
  );

  return isConfiance ? [...teams, CONFIANCE] : teams;
}
