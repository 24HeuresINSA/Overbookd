import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { team } from "~/utils/models/repo";

const resource = "/team";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getTeams(context: Context) {
    return context.$axios.get(resource);
  },
  linkUserToTeams(context: Context, userId: number, teams: team[]) {
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
