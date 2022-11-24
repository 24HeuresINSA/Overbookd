import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { permission } from "~/utils/models/repo";
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
    (permissionName: string, userTeams: number[]): boolean => {
      const permission = getters.allPermissions
        .filter((t: permission) => t.name === permissionName)
        .shift();
      // console.log(permissionName, permission, userTeams);
      if (permission && userTeams && Array(userTeams).length > 0) {
        return permission.teams.some((teamId: number) =>
          userTeams.includes(teamId)
        );
      }
      return false;
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
    async linkPermissionToTeams(
      constext,
      { permissionId, teamIds }: { permissionId: number; teamIds: number[] }
    ): Promise<any> {
      return safeCall(
        this,
        permissionRepo.linkPermissionToTeams(this, permissionId, teamIds)
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
