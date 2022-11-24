import { NuxtAxiosInstance } from "@nuxtjs/axios";

const resource = "/permission";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getPermissions(context: Context) {
    return context.$axios.get(resource);
  },
  linkPermissionToTeams(
    context: Context,
    permissionId: number,
    teamIds: number[]
  ) {
    return context.$axios.post(`${resource}/link/${permissionId}`, {
      teamIds,
    });
  },
  removePermission(context: Context, permissionId: number) {
    return context.$axios.delete(`${resource}/${permissionId}`);
  },
};
