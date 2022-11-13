import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { team } from "~/utils/models/repo";

const resource = "/permission";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getPermissions(context: Context) {
    return context.$axios.get(resource);
  },
  linkPermissionToTeams(context: Context, permissionId: number, teams: team[]) {
    return context.$axios.post(`${resource}/link/${permissionId}`, {
      teams,
    });
  },
};
