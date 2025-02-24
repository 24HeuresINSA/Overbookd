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

  static revoke(permission: string, code: string) {
    return HttpClient.delete<void>(
      `${this.basePath}/${permission}/teams/${code}`,
    );
  }

  static grant(permission: string, team: string) {
    return HttpClient.post<void>(`${this.basePath}/${permission}/teams`, {
      team,
    });
  }
}
