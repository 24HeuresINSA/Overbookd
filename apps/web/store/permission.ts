import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { CreatePermissionForm, Permission } from "~/utils/models/permission.model";
import { CompleteUserWithPermissions } from "~/utils/models/user.model";

const permissionRepo = RepoFactory.PermissionRepository;

// The state types definitions
interface State {
  permissions: Permission[];
}

export const state = (): State => ({
  permissions: [],
});

export const getters = getterTree(state, {
  allPermissions(state): Permission[] {
    return state.permissions;
  },
  isValidated:
    () =>
    (user: CompleteUserWithPermissions): boolean => {
      return user.permissions.includes("validated-user");
    },
});

export const mutations = mutationTree(state, {
  SET_PERMISSIONS(state, permissions: Permission[]) {
    state.permissions = permissions;
  },
  ADD_PERMISSION(state, permission: Permission) {
    state.permissions = [...state.permissions, permission];
  },
  REMOVE_PERMISSION(state, permissionId: number) {
    state.permissions = state.permissions.filter(
      (permission) => permission.id !== permissionId,
    );
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchPermissions({ commit }): Promise<void> {
      const res = await safeCall(this, permissionRepo.getPermissions(this));
      if (!res) return;
      commit("SET_PERMISSIONS", res.data);
    },
    async createPermission(
      { commit },
      payload: CreatePermissionForm,
    ): Promise<void> {
      const res = await safeCall(
        this,
        permissionRepo.createPermission(this, payload),
        { successMessage: "Permission créée ✅" },
      );
      if (!res) return;
      commit("ADD_PERMISSION", res.data);
    },
    async updatePermission(
      { dispatch },
      payload: CreatePermissionForm,
    ): Promise<void> {
      const res = safeCall(
        this,
        permissionRepo.updatePermission(this, payload),
      );
      if (!res) return;
      dispatch("fetchPermissions");
    },
    async removePermission(
      { commit },
      { permissionId }: { permissionId: number },
    ): Promise<void> {
      const res = await safeCall(
        this,
        permissionRepo.removePermission(this, permissionId),
      );
      if (!res) return;
      commit("REMOVE_PERMISSION", permissionId);
    },
    async linkPermissionToTeams(
      { dispatch },
      {
        permissionId,
        teamCodes,
      }: { permissionId: number; teamCodes: string[] },
    ): Promise<void> {
      const res = await safeCall(
        this,
        permissionRepo.linkPermissionToTeams(this, permissionId, teamCodes),
      );
      if (!res) return;
      dispatch("fetchPermissions");
    },
  },
);
