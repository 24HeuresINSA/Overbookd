import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { User } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const UserRepo = RepoFactory.userRepo;

export const state = () => ({
  me: {} as User,
  usernames: [] as Partial<User>[],
});

export type UserState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_USER(state: UserState, data: User) {
    state.me = data;
  },
  SET_USERNAMES(state: UserState, data: User[]) {
    state.usernames = data;
  },
  UPDATE_USER(state: UserState, data: Partial<User>) {
    Object.assign(state.me, data);
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchUser({ commit }) {
      const res = await safeCall(this, UserRepo.getMyUser(this));
      if (res) {
        commit("SET_USER", res.data);
      }
    },
    async fetchUsernames({ commit }) {
      const res = await safeCall(this, UserRepo.getAllUsernames(this));
      if (res) {
        commit("SET_USERNAMES", res.data);
      }
    },
    async getUsername({ dispatch, commit, state }, userID) {
      if (state.usernames.length === 0) {
        await dispatch("fetchUsernames");
      }
      const u = state.usernames.find((u) => u._id === userID);
      if (u) {
        return u.username;
      }
    },
    async updateUser(
      { commit },
      payload: { userID: string; userData: Partial<User> }
    ) {
      const res = await safeCall(
        this,
        UserRepo.updateUser(this, payload.userID, payload.userData)
      );
      if (res) {
        commit("UPDATE_USER", payload.userData);
        return true;
      }
      return false;
    },

    hasRole(state, roles: string | string[]) {
      if (roles === undefined) {
        return true;
      }
      const teams = state.state.me.team;
      if (teams === undefined) {
        return false;
      }
      if (typeof roles == "string") {
        roles = [roles];
      }
      return roles.some((r) => teams.includes(r));
    },
  }
);

/**
 * @deprecated
 */
export interface UserActions {
  fetchUser: number;
  updateUser: { userID: string; userData: Partial<User> };
}
