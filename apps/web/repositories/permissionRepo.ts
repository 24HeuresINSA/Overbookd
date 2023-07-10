import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Permission, CreatePermissionForm } from "~/utils/models/Permission";

const resource = "/permission";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getPermissions(context: Context) {
    return context.$axios.get<Permission[]>(resource);
  },
  createPermission(context: Context, payload: CreatePermissionForm) {
    return context.$axios
      .post<Permission>(resource, payload)
      .then(() => "Permission created successfully")
      .catch((err) => err.response.data.message);
  },
  updatePermission(context: Context, payload: CreatePermissionForm) {
    return context.$axios.patch<Permission>(
      `${resource}/${payload.id}`,
      payload
    );
  },
  removePermission(context: Context, permissionId: number) {
    return context.$axios.delete(`${resource}/${permissionId}`);
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
};
