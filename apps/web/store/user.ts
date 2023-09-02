import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { updateItemToList } from "@overbookd/list";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import {
  MyUserInformationWithProfilePicture,
  UserPersonnalDataWithProfilePicture,
  VolunteerAssignmentStat,
  VolunteerTask,
  castToUserUpdateForm,
  castUserWithDate,
  castVolunteerTaskWithDate,
} from "~/utils/models/user.model";
import { MyUserInformation, User, UserPersonnalData } from "@overbookd/user";

const userRepo = RepoFactory.UserRepository;

export const state = () => ({
  me: {} as MyUserInformation | MyUserInformationWithProfilePicture,
  users: [] as (UserPersonnalData | UserPersonnalDataWithProfilePicture)[],
  selectedUser: {} as UserPersonnalData | UserPersonnalDataWithProfilePicture,
  selectedUserFriends: [] as User[],
  selectedUserFtRequests: [] as VolunteerTask[],
  selectedUserAssignments: [] as VolunteerTask[],
  selectedUserAssignmentStats: [] as VolunteerAssignmentStat[],
  personalAccountConsumers: [] as UserPersonnalData[],
  volunteers: [] as UserPersonnalData[],
  candidates: [] as UserPersonnalData[],
  friends: [] as User[],
  mFriends: [] as User[],
});

export type UserState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_USER(state: UserState, data: MyUserInformation) {
    state.me = data;
  },
  SET_SELECTED_USER(state: UserState, data: UserPersonnalData) {
    state.selectedUser = data;
  },
  SET_SELECTED_USER_FRIENDS(state: UserState, friends: User[]) {
    state.selectedUserFriends = friends;
  },
  SET_SELECTED_USER_FT_REQUESTS(state: UserState, periods: VolunteerTask[]) {
    state.selectedUserFtRequests = periods;
  },
  SET_SELECTED_USER_ASSIGNMENT(state: UserState, assignments: VolunteerTask[]) {
    state.selectedUserAssignments = assignments;
  },
  SET_SELECTED_USER_ASSIGNMENT_STATS(
    state: UserState,
    stats: VolunteerAssignmentStat[],
  ) {
    state.selectedUserAssignmentStats = stats;
  },
  SET_USERS(state: UserState, data: UserPersonnalData[]) {
    state.users = data;
  },
  SET_PERSONNAL_ACCOUNT_CONSUMMERS(
    state: UserState,
    data: UserPersonnalData[],
  ) {
    state.personalAccountConsumers = data;
  },
  UPDATE_USER(state: UserState, data: UserPersonnalData) {
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
  SET_VOLUNTEERS(state: UserState, volunteers: UserPersonnalData[]) {
    state.volunteers = volunteers;
  },
  SET_CANDIDATES(state: UserState, candidates: UserPersonnalData[]) {
    state.candidates = candidates;
  },
});

export const getters = getterTree(state, {
  can: (state: UserState) => (permission?: string) => {
    if (!permission) return true;
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
    async setSelectedUser({ commit }, user: UserPersonnalData) {
      const res = await safeCall(this, userRepo.getUserFriends(this, user.id));
      if (!res) return;
      commit("SET_SELECTED_USER_FRIENDS", res.data);
      commit("SET_SELECTED_USER", user);
    },
    async fetchUser({ commit }) {
      const res = await safeCall(this, userRepo.getMyUser(this), {
        errorMessage: "Session expirée 💨",
      });
      if (res) {
        commit("SET_USER", castUserWithDate(res.data));
      }
    },
    async fetchUsers({ commit }) {
      const res = await safeCall(this, userRepo.getAllUsers(this));
      if (res) {
        commit("SET_USERS", res.data.map(castUserWithDate));
      }
    },
    async fetchVolunteers({ commit }) {
      const res = await safeCall(this, userRepo.getVolunteers(this));
      if (!res) return;
      const volunteers = res.data.map(castUserWithDate);
      commit("SET_VOLUNTEERS", volunteers);
    },
    async fetchCandidates({ commit }) {
      const res = await safeCall(this, userRepo.getCandidates(this));
      if (!res) return;
      const candidates = res.data.map(castUserWithDate);
      commit("SET_CANDIDATES", candidates);
    },
    async fetchFriends({ commit }) {
      const res = await safeCall(this, userRepo.getFriends(this));
      if (res) {
        commit("SET_FRIENDS", res.data);
      }
    },
    async fetchMyFriends({ commit, state }) {
      const res = await safeCall(
        this,
        userRepo.getUserFriends(this, state.me.id),
      );
      if (res) {
        commit("SET_MY_FRIENDS", res.data);
      }
    },
    async addFriend({ commit }, friend: User) {
      const res = await safeCall(this, userRepo.addFriend(this, friend.id), {
        successMessage: `${friend.firstname} a été ajouté à tes amis 🎉`,
        errorMessage: `${friend.firstname} n'a pas pu être ajouté à tes amis 😢`,
      });
      if (res) {
        commit("ADD_MY_FRIEND", res.data);
      }
    },
    async removeFriend({ commit }, friend: User) {
      const res = await safeCall(this, userRepo.removeFriend(this, friend.id), {
        successMessage: `${friend.firstname} a été supprimé de tes amis`,
        errorMessage: `${friend.firstname} n'a pas pu être supprimé de tes amis`,
      });
      if (res) {
        commit("REMOVE_MY_FRIEND", friend);
      }
    },
    async fetchPersonnalAccountConsummers({ commit }) {
      const res = await safeCall(
        this,
        userRepo.getAllPersonnalAccountConsummers(this),
      );
      if (!res) return;

      const consummers = res.data.map(castUserWithDate);
      commit("SET_PERSONNAL_ACCOUNT_CONSUMMERS", consummers);
    },
    async updateUser({ commit, dispatch, state }, user: UserPersonnalData) {
      if (state.me.id === user.id) return dispatch("updateMyUser");

      const res = await safeCall(
        this,
        userRepo.updateUser(this, user.id, castToUserUpdateForm(user)),
        {
          successMessage: "Profil mis à jour ! 🎉",
          errorMessage: "Mince, le profil n'a pas pu être mis à jour 😢",
        },
      );
      if (!res) return;
      commit("UPDATE_USER", castUserWithDate(res.data));
    },
    async updateMyUser({ commit }, user: UserPersonnalData) {
      const res = await safeCall(this, userRepo.updateMyUser(this, user), {
        successMessage: "Profil mis à jour ! 🎉",
        errorMessage: "Mince, le profil n'a pas pu être mis à jour 😢",
      });
      if (!res) return;
      commit("UPDATE_USER", castUserWithDate(res.data));
      commit("SET_USER", castUserWithDate(res.data));
    },
    async updateComment({ commit }, comment: string) {
      const res = await safeCall(
        this,
        userRepo.updateMyUser(this, { comment }),
        {
          successMessage: "Commentaire mis à jour ! 🎉",
          errorMessage: "Mince, le commentaire n'a pas pu être mis à jour 😢",
        },
      );
      if (!res) return;
      commit("UPDATE_USER", castUserWithDate(res.data));
      commit("SET_USER", castUserWithDate(res.data));
    },

    async deleteUser({ commit, state, dispatch }, userId: number) {
      const res = await safeCall(this, userRepo.deleteUser(this, userId), {
        successMessage: "Utilisateur supprimé ! 🎉",
        errorMessage: "Mince, l'utilisateur n'a pas pu être supprimé 😢",
      });
      if (!res) return;
      const user = { ...state.selectedUser, isDeleted: true };
      commit("UPDATE_USER", user);
      if (user.id === state.me.id) dispatch("fetchUser");
    },

    async updateSelectedUserTeams(
      { commit, state, dispatch },
      teams: string[],
    ) {
      const res = await safeCall(
        this,
        RepoFactory.TeamRepository.linkUserToTeams(
          this,
          state.selectedUser.id,
          teams,
        ),
        {
          successMessage: "Equipes mises à jour ! 🎉",
          errorMessage: "Mince, les équipes n'ont pas pu être mises à jour 😢",
        },
      );
      if (!res) return;
      const user: UserPersonnalData = {
        ...state.selectedUser,
        teams: res.data.teams,
      };
      commit("UPDATE_USER", user);
      commit("SET_SELECTED_USER", user);
      if (res.data.userId === state.me.id) dispatch("fetchUser");
    },

    async fetchAndUpdateLocalUser({ commit, state, dispatch }, userId: number) {
      const res = await safeCall(this, userRepo.getUser(this, userId));
      if (!res) return;
      const user = { ...state.selectedUser, charisma: res.data.charisma };
      commit("UPDATE_USER", user);
      if (res.data.id === state.me.id) dispatch("fetchUser");
    },

    async findUserById({ commit }, id: number) {
      const res = await safeCall(this, userRepo.getUser(this, id));
      if (!res) return;
      commit("SET_SELECTED_USER", res.data);
    },

    async getUserFtRequests({ commit }, userId: number) {
      const res = await safeCall(
        this,
        userRepo.getUserFtRequests(this, userId),
      );

      if (!res) return;
      const periods = castVolunteerTaskWithDate(res.data);
      commit("SET_SELECTED_USER_FT_REQUESTS", periods);
    },

    async addProfilePicture({ commit }, profilePicture: FormData) {
      const res = await safeCall(
        this,
        userRepo.addProfilePicture(this, profilePicture),
        { successMessage: "Photo de profil mise à jour ! 🎉" },
      );

      if (!res) return;
      commit("SET_USER", castUserWithDate(res.data));
    },

    getProfilePicture(_, user: MyUserInformationWithProfilePicture) {
      if (!user.profilePicture) return undefined;
      if (user.profilePictureBlob) return user.profilePictureBlob;

      return userRepo.getProfilePicture(this, user.id);
    },

    async setMyProfilePicture({ commit, state, dispatch }) {
      const user = state.me;
      const profilePictureBlob = await dispatch("getProfilePicture", user);
      if (!profilePictureBlob) return;

      commit("SET_USER", {
        ...state.me,
        profilePictureBlob,
      });
    },

    async setSelectedUserProfilePicture({ commit, state, dispatch }) {
      const user = state.selectedUser;
      const profilePictureBlob = await dispatch("getProfilePicture", user);
      if (!profilePictureBlob) return;

      commit("SET_SELECTED_USER", {
        ...state.selectedUser,
        profilePictureBlob,
      });
    },

    async setProfilePicture({ commit, dispatch }, user: UserPersonnalData) {
      const profilePictureBlob = await dispatch("getProfilePicture", user);
      if (!profilePictureBlob) return;

      commit("UPDATE_USER", {
        ...user,
        profilePictureBlob,
      });
    },

    async getVolunteerAssignments({ commit }, userId: number) {
      const res = await safeCall(
        this,
        userRepo.getVolunteerAssignments(this, userId),
      );

      if (!res) return;
      const periods = castVolunteerTaskWithDate(res.data);
      commit("SET_SELECTED_USER_ASSIGNMENT", periods);
    },

    async getVolunteerAssignmentStats({ commit }, userId: number) {
      const res = await safeCall(
        this,
        userRepo.getVolunteerAssignmentStats(this, userId),
      );

      if (!res) return;
      commit("SET_SELECTED_USER_ASSIGNMENT_STATS", res.data);
    },
  },
);
