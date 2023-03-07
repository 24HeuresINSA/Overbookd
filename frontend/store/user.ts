import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { User } from "~/utils/models/repo";
import {
  castToUserModification,
  Friend,
  UserCreation,
  UserWithPermissions,
} from "~/utils/models/user";
import { safeCall } from "~/utils/api/calls";

const UserRepo = RepoFactory.userRepo;

export const state = () => ({
  me: {} as User,
  users: [] as UserWithPermissions[],
  usernames: [] as Partial<User>[],
  mUser: {} as User,
  timeslots: [],
  friends: [] as Friend[],
  mFriends: [] as Friend[],
});

export type UserState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_USER(state: UserState, data: User) {
    state.me = data;
  },
  SET_SELECTED_USER(state: UserState, data: User) {
    state.mUser = data;
  },
  SET_USERS(state: UserState, data: UserWithPermissions[]) {
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
  SET_FRIENDS(state: UserState, friends: Friend[]) {
    state.friends = friends;
  },
  SET_MY_FRIENDS(state: UserState, friends: Friend[]) {
    state.mFriends = friends;
  },
  ADD_MY_FRIEND(state: UserState, friend: Friend) {
    state.mFriends = [...state.mFriends, friend];
  },
  REMOVE_MY_FRIEND(state: UserState, friend: Friend) {
    state.mFriends = state.mFriends.filter((f) => f.id !== friend.id);
  },
});

export const getters = getterTree(state, {
  availabilities: (state: UserState) => {
    return state.mUser.availabilities.map((_id) => {
      return state.timeslots.find((_timeslot) => _timeslot === _id);
    });
  },
  hasPermission: (state: UserState) => (permission?: string) => {
    if (!permission) return true;
    return (
      state.me.permissions.includes("admin") ||
      state.me.permissions.includes(permission) ||
      false
    );
  },
  validatedUsers: (state: UserState) => {
    return state.users.filter(({ permissions }) =>
      permissions.includes("validated-user")
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
      const res = await safeCall(this, UserRepo.getMyUser(this), {
        errorMessage: "Session expirée 💨",
      });
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
    async fetchFriends({ commit }) {
      const res = await safeCall(this, UserRepo.getFriends(this));
      if (res) {
        commit("SET_FRIENDS", res.data);
      }
    },
    async fetchMyFriends({ commit, state }) {
      const res = await safeCall(
        this,
        UserRepo.getUserFriends(this, +state.me.id)
      );
      if (res) {
        commit("SET_MY_FRIENDS", res.data);
      }
    },
    async addFriend({ commit }, friend: Friend) {
      const res = await safeCall(this, UserRepo.addFriend(this, friend.id), {
        successMessage: `${friend.firstname} a été ajouté à tes amis 🎉`,
        errorMessage: `${friend.firstname} n'a pas pu être ajouté à tes amis 😢`,
      });
      if (res) {
        commit("ADD_MY_FRIEND", res.data);
      }
    },
    async removeFriend({ commit }, friend: Friend) {
      const res = await safeCall(this, UserRepo.removeFriend(this, friend.id), {
        successMessage: `${friend.firstname} a été supprimé de tes amis`,
        errorMessage: `${friend.firstname} n'a pas pu être supprimé de tes amis`,
      });
      if (res) {
        commit("REMOVE_MY_FRIEND", friend);
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
    async createUser(_, user: UserCreation): Promise<any | undefined> {
      const res = await safeCall(this, UserRepo.createUser(this, user), {
        successMessage: "🎉 Inscription terminée, Bienvenue au 24 ! 🎉",
        errorMessage: "Mince, le compte n'a pas pu être créé 😢",
      });
      return res;
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
    async updateUser({ commit }, user: User) {
      const { id, ...userData } = user;
      const res = await safeCall(
        this,
        UserRepo.updateUser(this, +id, castToUserModification(userData))
      );
      if (res) {
        commit("UPDATE_USER", userData);
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
