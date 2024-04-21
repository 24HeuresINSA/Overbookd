import { HttpStringified } from "@overbookd/http";
import {
  Permission,
  CreatePermissionForm,
} from "~/utils/models/permission.model";
import { Context } from "./context";

export class PermissionRepository {
  private static readonly basePath = "permissions";

  static getPermissions(context: Context) {
    return context.$axios.get<HttpStringified<Permission[]>>(this.basePath);
  }

  static createPermission(context: Context, payload: CreatePermissionForm) {
    return context.$axios.post<HttpStringified<Permission>>(
      this.basePath,
      payload,
    );
  }

  static updatePermission(context: Context, payload: CreatePermissionForm) {
    return context.$axios.patch<Permission>(
      `${this.basePath}/${payload.id}`,
      payload,
    );
  }

  static removePermission(context: Context, permissionId: number) {
    return context.$axios.delete(`${this.basePath}/${permissionId}`);
  }

  static linkPermissionToTeams(
    context: Context,
    permissionId: number,
    teamCodes: string[],
  ) {
    return context.$axios.post(`${this.basePath}/link/${permissionId}`, {
      teamCodes,
    });
  }
}
