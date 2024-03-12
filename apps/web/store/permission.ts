import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { PermissionRepository } from "~/repositories/permission.repository";
import { safeCall } from "~/utils/api/calls";
import {
  CreatePermissionForm,
  Permission,
} from "~/utils/models/permission.model";

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
      const res = await safeCall(
        this,
        PermissionRepository.getPermissions(this),
      );
      if (!res) return;
      commit("SET_PERMISSIONS", res.data);
    },
    async createPermission(
      { commit },
      payload: CreatePermissionForm,
    ): Promise<void> {
      const res = await safeCall(
        this,
        PermissionRepository.createPermission(this, payload),
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
        PermissionRepository.updatePermission(this, payload),
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
        PermissionRepository.removePermission(this, permissionId),
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
        PermissionRepository.linkPermissionToTeams(
          this,
          permissionId,
          teamCodes,
        ),
      );
      if (!res) return;
      dispatch("fetchPermissions");
    },
  },
);
