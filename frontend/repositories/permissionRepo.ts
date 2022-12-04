import { NuxtAxiosInstance } from "@nuxtjs/axios";

const resource = "/permission";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getPermissions(context: Context) {
    return context.$axios.get(resource);
  },
  createPermission(context: Context, payload: any) {
    return context.$axios.post(resource, payload).catch((err) => {
      return err.response.data.message;
    });
  },
  linkPermissionToTeams(
    context: Context,
    permissionId: number,
    teamCodes: string[]
  ) {
    return context.$axios.post(`${resource}/link/${permissionId}`, {
      teamCodes,
    });
  },
  removePermission(context: Context, permissionId: number) {
    return context.$axios.delete(`${resource}/${permissionId}`);
  },
};
