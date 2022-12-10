import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { permission, User } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const permissionRepo = RepoFactory.permissionRepo;

// The state types definitions
interface State {
  permissions: permission[];
}

export const state = (): State => ({
  permissions: [],
});

export const getters = getterTree(state, {
  allPermissions(state): permission[] {
    return state.permissions;
  },
  isAllowed:
    (state, getters) =>
    (permissionName: string, userTeams: string[]): boolean => {
      if (userTeams.includes("admin")) return true;
      const permission = getters.allPermissions
        .filter((t: permission) => t.name === permissionName)
        .shift();
      if (permission && userTeams && Array(userTeams).length > 0) {
        return permission.teams.some((teamCode: string) =>
          userTeams.includes(teamCode)
        );
      }
      return false;
    },
  isValidated:
    (state, getters) =>
    (user: User): boolean => {
      return getters.isAllowed("validated-user", user.team);
    },
});

export const mutations = mutationTree(state, {
  SET_PERMISSIONS(state, permissions: any) {
    state.permissions = permissions;
  },
  ADD_PERMISSION(state, permission: any) {
    state.permissions.push(permission);
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async setPermissionsInStore(context): Promise<any> {
      const res = await safeCall(this, permissionRepo.getPermissions(this));
      if (res) {
        context.commit("SET_PERMISSIONS", res.data);
      }
      return res;
    },
    createPermission(context, payload: any): Promise<any> {
      return permissionRepo.createPermission(this, payload);
    },
    async linkPermissionToTeams(
      constext,
      { permissionId, teamCodes }: { permissionId: number; teamCodes: string[] }
    ): Promise<any> {
      return safeCall(
        this,
        permissionRepo.linkPermissionToTeams(this, permissionId, teamCodes)
      );
    },
    async removePermission(
      constext,
      { permissionId }: { permissionId: number }
    ): Promise<any> {
      return safeCall(
        this,
        permissionRepo.removePermission(this, permissionId)
      );
    },
  }
);
