import type { CreatePermissionForm, Permission } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import { PermissionRepository } from "~/repositories/permission.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

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
      sendSuccessNotification("Permission créée");
      this.permissions = [...this.permissions, res];
    },

    async updatePermission(payload: CreatePermissionForm) {
      const res = await PermissionRepository.updatePermission(payload);
      if (isHttpError(res)) return;
      sendSuccessNotification("Permission modifiée");
      this._updatePermission(res);
    },

    async removePermission(permissionId: number) {
      const res = await PermissionRepository.removePermission(permissionId);
      if (isHttpError(res)) return;
      sendSuccessNotification("Permission supprimée");
      this.permissions = this.permissions.filter(
        (permission) => permission.id !== permissionId,
      );
    },

    async revoke(permission: string, teamCode: string) {
      const res = await PermissionRepository.revoke(permission, teamCode);
      if (isHttpError(res)) return;
      sendSuccessNotification("Permission retirée");
      this._updateTeamInPermission(permission, teamCode, filterOut);
    },

    async grant(permission: string, teamCode: string) {
      const res = await PermissionRepository.grant(permission, teamCode);
      if (isHttpError(res)) return;
      sendSuccessNotification("Permission accordée");
      this._updateTeamInPermission(permission, teamCode, addWithoutDuplication);
    },

    _updateTeamInPermission(
      permissionName: string,
      teamCode: string,
      update: (teams: string[], team: string) => string[],
    ) {
      const index = this.permissions.findIndex(
        ({ name }) => name === permissionName,
      );
      const permission = this.permissions.at(index);
      const permissionNotFound = permission === undefined || index === -1;
      if (permissionNotFound) return;

      const teams = update(permission.teams, teamCode);
      const updatedPermission = { ...permission, teams };
      this.permissions = updateItemToList(
        this.permissions,
        index,
        updatedPermission,
      );
    },

    _updatePermission(permission: Permission) {
      const index = this.permissions.findIndex((p) => p.id === permission.id);
      if (index === -1) return;
      this.permissions = updateItemToList(this.permissions, index, permission);
    },
  },
});

function filterOut(teams: string[], team: string): string[] {
  return teams.filter((code) => code !== team);
}

function addWithoutDuplication(teams: string[], team: string): string[] {
  return [...new Set([...teams, team])];
}
