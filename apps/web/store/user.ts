import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { updateItemToList } from "@overbookd/list";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import {
  MyUserInformationWithProfilePicture,
  UserPersonalDataWithProfilePicture,
  VolunteerAssignmentStat,
  VolunteerTask,
  castToUserUpdateForm,
  castUserWithDate,
  castVolunteerTaskWithDate,
} from "~/utils/models/user.model";
import {
  MyUserInformation,
  Profile,
  User,
  UserPersonalData,
} from "@overbookd/user";
import { Permission } from "@overbookd/permission";
import { Consumer } from "~/utils/models/user.model";

const userRepo = RepoFactory.UserRepository;

export const state = () => ({
  me: {} as MyUserInformation | MyUserInformationWithProfilePicture,
  users: [] as (UserPersonalData | UserPersonalDataWithProfilePicture)[],
  selectedUser: {} as UserPersonalData | UserPersonalDataWithProfilePicture,
  selectedUserFriends: [] as User[],
  selectedUserFtRequests: [] as VolunteerTask[],
  selectedUserAssignments: [] as VolunteerTask[],
  selectedUserAssignmentStats: [] as VolunteerAssignmentStat[],
  personalAccountConsumers: [] as Consumer[],
  volunteers: [] as (UserPersonalData | UserPersonalDataWithProfilePicture)[],
  friends: [] as User[],
  mFriends: [] as User[],
});

export type UserState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_MY_USER(state: UserState, data: MyUserInformation) {
    state.me = data;
  },
  SET_SELECTED_USER(state: UserState, data: UserPersonalData) {
    state.selectedUser = data;
  },
  ADD_TEAMS_TO_SELECTED_USER(state: UserState, teams: string[]) {
    state.selectedUser.teams = [
      ...new Set([...state.selectedUser.teams, ...teams]),
    ];
  },
  REMOVE_TEAM_FROM_SELECTED_USER(state: UserState, team: string) {
    state.selectedUser.teams = state.selectedUser.teams.filter(
      (t) => t !== team,
    );
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
  SET_USERS(state: UserState, data: UserPersonalData[]) {
    state.users = data;
  },
  SET_PERSONAL_ACCOUNT_CONSUMERS(state: UserState, data: Consumer[]) {
    state.personalAccountConsumers = data;
  },
  UPDATE_USER(state: UserState, data: UserPersonalData) {
    const index = state.users.findIndex((user) => user.id === data.id);
    if (index === -1) return;
    state.users = updateItemToList(state.users, index, data);
  },
  REMOVE_USER(state: UserState, id: number) {
    state.users = state.users.filter((user) => user.id !== id);
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
  SET_VOLUNTEERS(state: UserState, volunteers: UserPersonalData[]) {
    state.volunteers = volunteers;
  },
  UPDATE_VOLUNTEER(
    state: UserState,
    data: UserPersonalData | UserPersonalDataWithProfilePicture,
  ) {
    const index = state.volunteers.findIndex(
      (volunteer) => volunteer.id === data.id,
    );
    if (index === -1) return;
    state.volunteers = updateItemToList(state.volunteers, index, data);
  },
  REMOVE_VOLUNTEER(state: UserState, id: number) {
    state.volunteers = state.volunteers.filter(
      (volunteer) => volunteer.id !== id,
    );
  },
});

export const getters = getterTree(state, {
  can: (state: UserState) => (permission?: Permission) => {
    if (!permission) return true;
    return (
      state.me.teams.includes("admin") ||
      state.me.permissions.includes(permission) ||
      false
    );
  },
});

export const actions = actionTree(
  { state },
  {
    async setSelectedUser({ commit }, user: UserPersonalData) {
      const res = await safeCall(this, userRepo.getUserFriends(this, user.id));
      if (!res) return;
      commit("SET_SELECTED_USER_FRIENDS", res.data);
      commit("SET_SELECTED_USER", user);
    },
    async fetchUser({ state, dispatch }) {
      dispatch("fetchMyInformation");
      if (!state.me) return;
      await dispatch("setMyProfilePicture");
    },
    async fetchMyInformation({ commit }) {
      const res = await safeCall(this, userRepo.getMyUser(this), {
        errorMessage: "Session expirée 💨",
      });
      if (!res) return;
      commit("SET_MY_USER", castUserWithDate(res.data));
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
    async fetchPersonalAccountConsumers({ commit }) {
      const res = await safeCall(
        this,
        userRepo.getAllPersonalAccountConsumers(this),
      );
      if (!res) return;

      const consumers = res.data.map(castUserWithDate);
      commit("SET_PERSONAL_ACCOUNT_CONSUMERS", consumers);
    },
    async updateUser(
      { commit, state, dispatch },
      user: UserPersonalData | UserPersonalDataWithProfilePicture,
    ) {
      const res = await safeCall(
        this,
        userRepo.updateUser(this, user.id, castToUserUpdateForm(user)),
        {
          successMessage: "Profil mis à jour ! 🎉",
          errorMessage: "Mince, le profil n'a pas pu être mis à jour 😢",
        },
      );
      if (!res) return;
      const updatedUser = castUserWithDate(res.data);
      commit("UPDATE_USER", updatedUser);
      commit("UPDATE_VOLUNTEER", updatedUser);
      if (state.selectedUser.id === state.me.id) dispatch("fetchUser");
    },
    async updateComment({ commit }, comment: string) {
      const res = await safeCall(
        this,
        userRepo.updateMyProfile(this, { comment }),
        {
          successMessage: "Commentaire mis à jour ! 🎉",
          errorMessage: "Mince, le commentaire n'a pas pu être mis à jour 😢",
        },
      );
      if (!res) return;
      commit("UPDATE_USER", castUserWithDate(res.data));
      commit("SET_MY_USER", castUserWithDate(res.data));
    },

    async updateMyProfile({ commit, state }, profile: Profile) {
      const res = await safeCall(
        this,
        userRepo.updateMyProfile(this, profile),
        {
          successMessage: "Profil mis à jour ! 🎉",
          errorMessage: "Mince, le profil n'a pas pu être mis à jour 😢",
        },
      );
      if (!res) return;
      const me = { ...state.me, ...castUserWithDate(res.data) };
      commit("UPDATE_USER", me);
      commit("SET_MY_USER", me);
    },

    async deleteUser({ commit }, userId: number) {
      const res = await safeCall(this, userRepo.deleteUser(this, userId), {
        successMessage: "Utilisateur supprimé ! 🎉",
        errorMessage: "Mince, l'utilisateur n'a pas pu être supprimé 😢",
      });
      if (!res) return;
      commit("REMOVE_USER", userId);
      commit("REMOVE_VOLUNTEER", userId);
    },

    async addTeamsToSelectedUser({ commit, state, dispatch }, teams: string[]) {
      const res = await safeCall(
        this,
        userRepo.addTeamsToUser(this, state.selectedUser.id, teams),
        { successMessage: "Equipe(s) ajoutée(s) ! 🎉" },
      );
      if (!res) return;
      commit("ADD_TEAMS_TO_SELECTED_USER", res.data);
      commit("UPDATE_USER", state.selectedUser);
      commit("UPDATE_VOLUNTEER", state.selectedUser);
      if (state.selectedUser.id === state.me.id) dispatch("fetchMyInformation");
    },

    async removeTeamFromSelectedUser(
      { commit, state, dispatch },
      team: string,
    ) {
      const res = await safeCall(
        this,
        userRepo.removeTeamFromUser(this, state.selectedUser.id, team),
        { successMessage: "Equipe retirée ! 🎉" },
      );
      if (!res) return;
      commit("REMOVE_TEAM_FROM_SELECTED_USER", team);
      commit("UPDATE_USER", state.selectedUser);
      commit("UPDATE_VOLUNTEER", state.selectedUser);
      if (state.selectedUser.id === state.me.id) dispatch("fetchMyInformation");
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
      commit("SET_MY_USER", castUserWithDate(res.data));
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

      commit("SET_MY_USER", {
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

    async setProfilePicture({ commit, dispatch }, user: UserPersonalData) {
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
