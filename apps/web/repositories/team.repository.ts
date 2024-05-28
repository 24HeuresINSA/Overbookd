import { HttpStringified, Team } from "@overbookd/http";
import { Context } from "../utils/api/axios";

export class TeamRepository {
  private static readonly basePath = "teams";

  static getTeams(context: Context) {
    return context.$axios.get<HttpStringified<Team[]>>(this.basePath);
  }

  static getFaValidators(context: Context) {
    return context.$axios.get<HttpStringified<Team[]>>(
      `${this.basePath}/fa-validators`,
    );
  }

  static getFtValidators(context: Context) {
    return context.$axios.get<HttpStringified<Team[]>>(
      `${this.basePath}/ft-validators`,
    );
  }

  static createTeam(context: Context, team: Team) {
    return context.$axios.post<HttpStringified<Team>>(this.basePath, team);
  }

  static updateTeam(context: Context, team: Team) {
    return context.$axios.patch<HttpStringified<Team>>(
      `${this.basePath}/${team.code}`,
      team,
    );
  }

  static deleteTeam(context: Context, teamCode: string) {
    return context.$axios.delete<void>(`${this.basePath}/${teamCode}`);
  }
}
