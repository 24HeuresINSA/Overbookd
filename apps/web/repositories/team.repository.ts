import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Team } from "~/utils/models/team";
import { HttpStringified } from "~/utils/types/http";

type Context = { $axios: NuxtAxiosInstance };

export class TeamRepository {
  private static readonly basePath = "teams";

  static getTeams(context: Context) {
    return context.$axios.get(this.basePath);
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
        permission: "fa-validator",
      },
    });
  }

  static getFtValidators(context: Context) {
    return context.$axios.get<Team[]>(this.basePath, {
      params: {
        permission: "ft-validator",
      },
    });
  }
}
