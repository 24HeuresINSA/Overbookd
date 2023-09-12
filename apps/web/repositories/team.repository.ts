import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Team } from "~/utils/models/team.model";
import { HttpStringified } from "~/utils/types/http";
import { VALIDATE_FA, VALIDATE_FT } from "@overbookd/permission";

type Context = { $axios: NuxtAxiosInstance };

export class TeamRepository {
  private static readonly basePath = "teams";

  static getTeams(context: Context) {
    return context.$axios.get<HttpStringified<Team[]>>(this.basePath);
  }

  static linkUserToTeams(context: Context, userId: number, teams: string[]) {
    return context.$axios.post<
      HttpStringified<{ userId: number; teams: string[] }>
    >(`${this.basePath}/link`, {
      userId,
      teams,
    });
  }

  static getFaValidators(context: Context) {
    return context.$axios.get<Team[]>(this.basePath, {
      params: {
        permission: VALIDATE_FA,
      },
    });
  }

  static getFtValidators(context: Context) {
    return context.$axios.get<Team[]>(this.basePath, {
      params: {
        permission: VALIDATE_FT,
      },
    });
  }

  static createTeam(context: Context, team: Team) {
    return context.$axios.post<Team>(this.basePath, team);
  }

  static updateTeam(context: Context, team: Team) {
    return context.$axios.patch<Team>(`${this.basePath}/${team.code}`, team);
  }

  static deleteTeam(context: Context, teamCode: string) {
    return context.$axios.delete<void>(`${this.basePath}/${teamCode}`);
  }
}
