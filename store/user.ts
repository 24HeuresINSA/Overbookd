import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { User } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";
const UserRepo = RepoFactory.get("user");

export const state = () => ({
  //TODO use class and change this
  me: {} as User,
});

export type UserState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_USER(state: UserState, data: User) {
    state.me = data;
  },
  UPDATE_USER(state: UserState, data: Partial<User>) {
    Object.assign(state.me, data);
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchUser({ commit }, userId: string) {
      const res = await safeCall(this, UserRepo.getUser(this, userId));
      if (res) {
        commit("SET_USER", res.data);
      }
    },
    async updateUser(
      { commit },
      payload: { userId: string; userData: Partial<User> }
    ) {
      const res = await safeCall(
        this,
        UserRepo.updateUser(this, payload.userId, payload.userData)
      );
      if (res) {
        commit("UPDATE_USER", payload.userData);
        return true;
      }
      return false;
    },
  }
);

/**
 * @deprecated
 */
export interface UserActions {
  fetchUser: number;
  updateUser: { userId: string; userData: Partial<User> };
}
