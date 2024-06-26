import type { CreatePermissionForm, Permission } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import { PermissionRepository } from "~/repositories/permission.repository";
import { isHttpError } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

type State = {
  permissions: Permission[];
};

export const usePermissionStore = defineStore("permission", {
  state: (): State => ({
    permissions: [],
  }),
  actions: {
    async fetchPermissions() {
      const res = await PermissionRepository.getPermissions();
      if (isHttpError(res)) return;
      this.permissions = res;
    },

    async createPermission(payload: CreatePermissionForm) {
      const res = await PermissionRepository.createPermission(payload);
      if (isHttpError(res)) return;
      sendNotification("Permission créée ✅");
      this.permissions = [...this.permissions, res];
    },

    async updatePermission(payload: CreatePermissionForm) {
      const res = await PermissionRepository.updatePermission(payload);
      if (isHttpError(res)) return;
      sendNotification("Permission modifiée ✅");
      this._updatePermission(res);
    },

    async removePermission(permissionId: number) {
      const res = await PermissionRepository.removePermission(permissionId);
      if (isHttpError(res)) return;
      this.permissions = this.permissions.filter(
        (permission) => permission.id !== permissionId,
      );
    },

    async linkPermissionToTeams(permissionId: number, teamCodes: string[]) {
      const res = await PermissionRepository.linkPermissionToTeams(
        permissionId,
        teamCodes,
      );
      if (isHttpError(res)) return;
      this._updatePermission(res);
    },

    _updatePermission(permission: Permission) {
      const index = this.permissions.findIndex((p) => p.id === permission.id);
      if (index === -1) return;
      this.permissions = updateItemToList(this.permissions, index, permission);
    },
  },
});
