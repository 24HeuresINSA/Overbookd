import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { User } from "~/utils/models/repo";
import { User as UserV2 } from "~/utils/models/user";
import { safeCall } from "~/utils/api/calls";

const UserRepo = RepoFactory.userRepo;

export const state = () => ({
  me: {} as User,
  users: [] as UserV2[],
  usernames: [] as Partial<User>[],
  mUser: {} as User,
  timeslots: [],
});

export type UserState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_USER(state: UserState, data: User) {
    state.me = data;
  },
  SET_SELECTED_USER(state: UserState, data: User) {
    state.mUser = data;
  },
  SET_USERS(state: UserState, data: UserV2[]) {
    state.users = data;
  },
  SET_USERNAMES(state: UserState, data: User[]) {
    data.sort(
      ({ username: username1 }: User, { username: username2 }: User) => {
        if (username1 && username2) {
          return username1 > username2 ? 1 : -1;
        }
        return 0;
      }
    );
    state.usernames = data;
  },
  UPDATE_USER(state: UserState, data: Partial<User>) {
    Object.assign(state.me, data);
  },
  SET_TIMESLOTS(state: UserState, data: any) {
    state.timeslots = data;
  },
});

export const getters = getterTree(state, {
  availabilities: (state: UserState) => {
    return state.mUser.availabilities.map((_id) => {
      return state.timeslots.find((_timeslot) => _timeslot === _id);
    });
  },
  hasPermission: (state: UserState) => (permission: string) => {
    return (
      state.me.permissions.includes("admin") ||
      state.me.permissions.includes(permission) ||
      false
    );
  },
});

export const actions = actionTree(
  { state },
  {
    async setSelectedUser({ commit, state }, user: User) {
      commit("SET_SELECTED_USER", user);
      if (state.timeslots.length === 0) {
        const timeslots = (await this.$axios.get("/availabilities")).data;
        commit("SET_TIMESLOTS", timeslots);
      }
    },
    async fetchUser({ commit }) {
      const res = await safeCall(this, UserRepo.getMyUser(this));
      if (res) {
        commit("SET_USER", res.data);
      }
    },
    async fetchUsers({ commit }) {
      const res = await safeCall(this, UserRepo.getAllUsers(this));
      if (res) {
        commit("SET_USERS", res.data);
      }
    },
    async fetchUsernames({ commit }) {
      const res = await safeCall(this, UserRepo.getAllUsernames(this));
      if (res) {
        commit("SET_USERNAMES", res.data);
      }
    },
    async fetchUsernamesWithCP({ commit }) {
      const res = await safeCall(this, UserRepo.getAllUsernamesWithCP(this));
      if (res) {
        commit("SET_USERNAMES", res.data);
      }
    },
    async getUsername({ dispatch, state }, userID) {
      if (state.usernames.length === 0) {
        await dispatch("fetchUsernames");
      }
      const u = state.usernames.find((u) => u.id === userID);
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

    async acceptSelection({ commit }, timeslotIDS: string[]) {
      const res = await safeCall(
        this,
        UserRepo.acceptSelection(this, timeslotIDS)
      );
      if (res) {
        commit("UPDATE_USER", res.data);
      }
      return;
    },
    async findUserById({ commit }, id: string) {
      const res = await UserRepo.getUser(this, id);

      if (res && res.data) commit("SET_SELECTED_USER", res.data);
      return res;
    },

    async removeAvailability(
      _,
      payload: { userID: string; timeslotID: string }
    ) {
      const res = await safeCall(
        this,
        UserRepo.removeAvailability(this, payload)
      );
      if (res) {
        return true;
      }
      return false;
    },
    async addAvailabilityToUser(
      _,
      payload: { userID: string; timeslotID: string }
    ) {
      const res = await safeCall(
        this,
        UserRepo.addAvailabilityToUser(this, payload)
      );
      if (res) {
        return true;
      }
      return false;
    },
  }
);
