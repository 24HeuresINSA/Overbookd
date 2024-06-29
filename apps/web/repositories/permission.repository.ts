import type { CreatePermissionForm, Permission } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class PermissionRepository {
  private static readonly basePath = "permissions";

  static getPermissions() {
    return HttpClient.get<Permission[]>(this.basePath);
  }

  static createPermission(permission: CreatePermissionForm) {
    return HttpClient.post<Permission>(this.basePath, permission);
  }

  static updatePermission(permission: CreatePermissionForm) {
    return HttpClient.patch<Permission>(
      `${this.basePath}/${permission.id}`,
      permission,
    );
  }

  static removePermission(permissionId: number) {
    return HttpClient.delete(`${this.basePath}/${permissionId}`);
  }

  static linkTeamsToPermission(permissionId: number, teamCodes: string[]) {
    return HttpClient.post<Permission>(
      `${this.basePath}/link/${permissionId}`,
      { teamCodes },
    );
  }
}
