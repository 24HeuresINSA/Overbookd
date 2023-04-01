import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { updateItemToList } from "~/utils/functions/list";
import { User as UserV1 } from "~/utils/models/repo";
import {
  AssignedOnTask,
  castAssignedOnTaskPeriodsWithDate,
  RequiredOnTask,
  User,
} from "~/utils/models/user";
import {
  castPeriodWithFtWithDate,
  castToUserModification,
  castUsersWithPermissionsWithDate,
  castUserWithDate,
  castUserWithPermissionsWithDate,
  CompleteUser,
  CompleteUserWithPermissions,
  UserCreation,
} from "~/utils/models/user";

const UserRepo = RepoFactory.userRepo;

export const state = () => ({
  me: {} as CompleteUser,
  users: [] as CompleteUserWithPermissions[],
  usernames: [] as Partial<UserV1>[],
  selectedUser: {} as CompleteUserWithPermissions,
  selectedUserFtRequests: [] as RequiredOnTask[],
  selectedUserAssignments: [] as AssignedOnTask[],
  friends: [] as User[],
  mFriends: [] as User[],
});

export type UserState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_USER(state: UserState, data: CompleteUser) {
    state.me = data;
  },
  SET_SELECTED_USER(state: UserState, data: CompleteUserWithPermissions) {
    state.selectedUser = data;
  },
  SET_SELECTED_USER_FT_REQUESTS(state: UserState, periods: RequiredOnTask[]) {
    state.selectedUserFtRequests = periods;
  },
  SET_SELECTED_USER_ASSIGNMENT(
    state: UserState,
    assignments: AssignedOnTask[]
  ) {
    state.selectedUserAssignments = assignments;
  },
  SET_USERS(state: UserState, data: CompleteUserWithPermissions[]) {
    state.users = data;
  },
  SET_USERNAMES(state: UserState, data: UserV1[]) {
    data.sort(
      ({ username: username1 }: UserV1, { username: username2 }: UserV1) => {
        if (username1 && username2) {
          return username1 > username2 ? 1 : -1;
        }
        return 0;
      }
    );
    state.usernames = data;
  },
  UPDATE_USER(state: UserState, data: CompleteUserWithPermissions) {
    const index = state.users.findIndex((user) => user.id === data.id);
    if (index !== -1) {
      state.users = updateItemToList(state.users, index, data);
    }
  },
  SET_FRIENDS(state: UserState, friends: User[]) {
    state.friends = friends;
  },
  SET_MY_FRIENDS(state: UserState, friends: User[]) {
    state.mFriends = friends;
  },
  ADD_MY_FRIEND(state: UserState, friend: User) {
    state.mFriends = [...state.mFriends, friend];
  },
  REMOVE_MY_FRIEND(state: UserState, friend: User) {
    state.mFriends = state.mFriends.filter((f) => f.id !== friend.id);
  },
});

export const getters = getterTree(state, {
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
    async setSelectedUser({ commit }, user: CompleteUserWithPermissions) {
      commit("SET_SELECTED_USER", user);
    },
    async fetchUser({ commit }) {
      const res = await safeCall(this, UserRepo.getMyUser(this), {
        errorMessage: "Session expirée 💨",
      });
      if (res) {
        commit("SET_USER", castUserWithDate(res.data));
      }
    },
    async fetchUsers({ commit }) {
      const res = await safeCall(this, UserRepo.getAllUsers(this));
      if (res) {
        commit("SET_USERS", castUsersWithPermissionsWithDate(res.data));
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
        UserRepo.getUserFriends(this, state.me.id)
      );
      if (res) {
        commit("SET_MY_FRIENDS", res.data);
      }
    },
    async addFriend({ commit }, friend: User) {
      const res = await safeCall(this, UserRepo.addFriend(this, friend.id), {
        successMessage: `${friend.firstname} a été ajouté à tes amis 🎉`,
        errorMessage: `${friend.firstname} n'a pas pu être ajouté à tes amis 😢`,
      });
      if (res) {
        commit("ADD_MY_FRIEND", res.data);
      }
    },
    async removeFriend({ commit }, friend: User) {
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
    async updateUser({ commit, state }, user: CompleteUserWithPermissions) {
      const { id, ...userData } = user;
      const res = await safeCall(
        this,
        UserRepo.updateUser(this, id, castToUserModification(userData)),
        {
          successMessage: "Profil mis à jour ! 🎉",
          errorMessage: "Mince, le profil n'a pas pu être mis à jour 😢",
        }
      );
      if (!res) return;
      commit("UPDATE_USER", castUserWithPermissionsWithDate(res.data));
      if (res.data.id === state.me.id) {
        commit("SET_USER", castUserWithDate(res.data));
      }
    },

    async updateComment({ commit }, comment: string) {
      const res = await safeCall(
        this,
        UserRepo.updateMyUser(this, { comment }),
        {
          successMessage: "Commentaire mis à jour ! 🎉",
          errorMessage: "Mince, le commentaire n'a pas pu être mis à jour 😢",
        }
      );
      if (!res) return;
      commit("UPDATE_USER", castUserWithPermissionsWithDate(res.data));
      commit("SET_USER", castUserWithDate(res.data));
    },

    async deleteUser({ commit, state }, userId: number) {
      const res = await safeCall(this, UserRepo.deleteUser(this, userId), {
        successMessage: "Utilisateur supprimé ! 🎉",
        errorMessage: "Mince, l'utilisateur n'a pas pu être supprimé 😢",
      });
      if (!res) return;
      const user = { ...state.selectedUser, is_deleted: true };
      commit("UPDATE_USER", user);
      if (user.id === state.me.id) commit("SET_USER", user);
    },

    async updateSelectedUserTeams({ commit, state }, teams: string[]) {
      const res = await safeCall(
        this,
        RepoFactory.teamRepo.linkUserToTeams(
          this,
          state.selectedUser.id,
          teams
        ),
        {
          successMessage: "Equipes mises à jour ! 🎉",
          errorMessage: "Mince, les équipes n'ont pas pu être mises à jour 😢",
        }
      );
      if (!res) return;
      const user: CompleteUserWithPermissions = {
        ...state.selectedUser,
        team: res.data.teams,
      };
      commit("UPDATE_USER", user);
      commit("SET_SELECTED_USER", user);
      if (res.data.userId === state.me.id) {
        commit("SET_USER", user);
      }
    },

    async fetchAndUpdateLocalUser({ commit, state }, userId: number) {
      const res = await safeCall(this, UserRepo.getUser(this, userId));
      if (!res) return;
      const user = { ...state.selectedUser, charisma: res.data.charisma };
      commit("UPDATE_USER", user);
      if (res.data.id === state.me.id) commit("SET_USER", user);
    },

    async findUserById({ commit }, id: number) {
      const res = await safeCall(this, UserRepo.getUser(this, id));
      if (!res) return;
      commit("SET_SELECTED_USER", res.data);
    },

    async getUserFtRequests({ commit }, userId: number) {
      const res = await safeCall(
        this,
        UserRepo.getUserFtRequests(this, userId)
      );

      if (!res) return;
      const periods = castPeriodWithFtWithDate(res.data);
      commit("SET_SELECTED_USER_FT_REQUESTS", periods);
    },

    async getVolunteerAssignments({ commit }, userId: number) {
      const res = await safeCall(
        this,
        UserRepo.getVolunteerAssignments(this, userId)
      );

      if (!res) return;
      const periods = castAssignedOnTaskPeriodsWithDate(res.data);
      commit("SET_SELECTED_USER_ASSIGNMENT", periods);
    },
  }
);
