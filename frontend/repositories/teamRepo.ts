import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Team } from "~/utils/models/team";
import { HttpStringified } from "~/utils/types/http";

const resource = "/team";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getTeams(context: Context) {
    return context.$axios.get(resource);
  },
  linkUserToTeams(context: Context, userId: number, teams: string[]) {
    return context.$axios.post<
      HttpStringified<{ userId: number; teams: string[] }>
    >(`${resource}/link`, {
      userId,
      teams,
    });
  },
  getFaValidators(context: Context) {
    return context.$axios.get<Team[]>(`${resource}`, {
      params: {
        permission: "fa-validator",
      },
    });
  },

  getFtValidators(context: Context) {
    return context.$axios.get<Team[]>(`${resource}`, {
      params: {
        permission: "ft-validator",
      },
    });
  },
};
