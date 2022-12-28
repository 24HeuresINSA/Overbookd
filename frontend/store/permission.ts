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
  isValidated:
    (state) =>
    (user: User): boolean => {
      return user.permissions?.includes("validated-user") || false;
    },
});

export const mutations = mutationTree(state, {
  SET_PERMISSIONS(state, permissions: any) {
    state.permissions = permissions;
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
    async updatePermission(context, payload: any): Promise<any> {
      return safeCall(this, permissionRepo.updatePermission(this, payload));
    },
    async removePermission(
      context,
      { permissionId }: { permissionId: number }
    ): Promise<any> {
      return safeCall(
        this,
        permissionRepo.removePermission(this, permissionId)
      );
    },
    async linkPermissionToTeams(
      context,
      { permissionId, teamCodes }: { permissionId: number; teamCodes: string[] }
    ): Promise<any> {
      return safeCall(
        this,
        permissionRepo.linkPermissionToTeams(this, permissionId, teamCodes)
      );
    },
    async faValidators(context): Promise<string[]> {
      if (context.state.permissions.length === 0) {
        await context.dispatch("setPermissionsInStore");
      }
      return (
        context.state.permissions.find(
          (permission: permission) => permission.name === "fa-validator"
        )?.teams || []
      );
    },
    async ftValidators(context): Promise<string[]> {
      if (context.state.permissions.length === 0) {
        await context.dispatch("setPermissionsInStore");
      }
      return (
        context.state.permissions.find(
          (permission: permission) => permission.name === "ft-validator"
        )?.teams || []
      );
    },
  }
);
