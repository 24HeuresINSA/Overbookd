import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Team } from "~/utils/models/team";

const resource = "/team";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getTeams(context: Context) {
    return context.$axios.get(resource);
  },
  linkUserToTeams(context: Context, userId: number, teams: Team[]) {
    return context.$axios.post(`${resource}/link`, {
      userId,
      teams,
    });
  },
  getFaValidators(context: Context) {
    return context.$axios.get(`${resource}`, {
      params: {
        permission: "fa-validator",
      },
    });
  },
};
