import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { updateItemToList } from "@overbookd/list";
import { safeCall } from "~/utils/api/calls";
import {
  MyUserInformationWithProfilePicture,
  UserPersonalDataWithProfilePicture,
  VolunteerAssignmentStat,
  VolunteerTask,
  castToUserUpdateForm,
  castUserWithDate,
  castVolunteerPlanningTasksWithDate,
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
import { PlanningTask } from "@overbookd/http";
import { UserRepository } from "~/repositories/user.repository";

type UserDataWithPotentialyProfilePicture =
  | UserPersonalData
  | UserPersonalDataWithProfilePicture;

type State = {
  me: MyUserInformation | MyUserInformationWithProfilePicture;
  users: UserDataWithPotentialyProfilePicture[];
  selectedUser: UserDataWithPotentialyProfilePicture;
  selectedUserFriends: User[];
  selectedUserFtRequests: VolunteerTask[];
  selectedUserAssignments: VolunteerTask[];
  selectedUserTasks: PlanningTask[];
  selectedUserAssignmentStats: VolunteerAssignmentStat[];
  personalAccountConsumers: Consumer[];
  volunteers: UserDataWithPotentialyProfilePicture[];
  adherents: User[];
  friends: User[];
  mFriends: User[];
};

export const state = (): State => ({
  me: {} as MyUserInformation | MyUserInformationWithProfilePicture,
  users: [],
  selectedUser: {} as UserDataWithPotentialyProfilePicture,
  selectedUserFriends: [],
  selectedUserFtRequests: [],
  selectedUserAssignments: [],
  selectedUserTasks: [],
  selectedUserAssignmentStats: [],
  personalAccountConsumers: [],
  volunteers: [],
  adherents: [],
  friends: [],
  mFriends: [],
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
  SET_SELECTED_USER_TASKS(state: UserState, tasks: PlanningTask[]) {
    state.selectedUserTasks = tasks;
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
  SET_ADHERENTS(state: UserState, adherents: User[]) {
    state.adherents = adherents;
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
  isMemberOf:
    ({ me }: UserState) =>
    (team: string) => {
      return me.teams.includes("admin") || me.teams.includes(team);
    },
});

export const actions = actionTree(
  { state },
  {
    async setSelectedUser({ commit }, user: UserPersonalData) {
      const res = await safeCall(
        this,
        UserRepository.getUserFriends(this, user.id),
      );
      if (!res) return;
      commit("SET_SELECTED_USER_FRIENDS", res.data);
      commit("SET_SELECTED_USER", user);
    },
    async fetchUser({ state, dispatch }) {
      await dispatch("fetchMyInformation");
      if (!state.me) return;
      await dispatch("setMyProfilePicture");
    },
    async fetchMyInformation({ commit }) {
      const res = await safeCall(this, UserRepository.getMyUser(this), {
        errorMessage: "Session expirée 💨",
      });
      if (!res) return;
      commit("SET_MY_USER", castUserWithDate(res.data));
    },
    cleanUser({ commit }) {
      commit("SET_MY_USER", {});
    },
    async fetchUsers({ commit }) {
      const res = await safeCall(this, UserRepository.getAllUsers(this));
      if (res) {
        commit("SET_USERS", res.data.map(castUserWithDate));
      }
    },
    async fetchVolunteers({ commit }) {
      const res = await safeCall(this, UserRepository.getVolunteers(this));
      if (!res) return;
      const volunteers = res.data.map(castUserWithDate);
      commit("SET_VOLUNTEERS", volunteers);
    },
    async fetchAdherents({ commit }) {
      const res = await safeCall(this, UserRepository.getAdherents(this));
      if (!res) return;
      commit("SET_ADHERENTS", res.data);
    },
    async fetchFriends({ commit }) {
      const res = await safeCall(this, UserRepository.getFriends(this));
      if (res) {
        commit("SET_FRIENDS", res.data);
      }
    },
    async fetchMyFriends({ commit, state }) {
      const res = await safeCall(
        this,
        UserRepository.getUserFriends(this, state.me.id),
      );
      if (res) {
        commit("SET_MY_FRIENDS", res.data);
      }
    },
    async addFriend({ commit }, friend: User) {
      const res = await safeCall(
        this,
        UserRepository.addFriend(this, friend.id),
        {
          successMessage: `${friend.firstname} a été ajouté à tes amis 🎉`,
          errorMessage: `${friend.firstname} n'a pas pu être ajouté à tes amis 😢`,
        },
      );
      if (res) {
        commit("ADD_MY_FRIEND", res.data);
      }
    },
    async removeFriend({ commit }, friend: User) {
      const res = await safeCall(
        this,
        UserRepository.removeFriend(this, friend.id),
        {
          successMessage: `${friend.firstname} a été supprimé de tes amis`,
          errorMessage: `${friend.firstname} n'a pas pu être supprimé de tes amis`,
        },
      );
      if (res) {
        commit("REMOVE_MY_FRIEND", friend);
      }
    },
    async fetchPersonalAccountConsumers({ commit }) {
      const res = await safeCall(
        this,
        UserRepository.getAllPersonalAccountConsumers(this),
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
        UserRepository.updateUser(this, user.id, castToUserUpdateForm(user)),
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
        UserRepository.updateMyProfile(this, { comment }),
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
        UserRepository.updateMyProfile(this, profile),
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
      const res = await safeCall(
        this,
        UserRepository.deleteUser(this, userId),
        {
          successMessage: "Utilisateur supprimé ! 🎉",
        },
      );
      if (!res) return;
      commit("REMOVE_USER", userId);
      commit("REMOVE_VOLUNTEER", userId);
    },

    async addTeamsToSelectedUser({ commit, state, dispatch }, teams: string[]) {
      const res = await safeCall(
        this,
        UserRepository.addTeamsToUser(this, state.selectedUser.id, teams),
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
        UserRepository.removeTeamFromUser(this, state.selectedUser.id, team),
        { successMessage: "Equipe retirée ! 🎉" },
      );
      if (!res) return;
      commit("REMOVE_TEAM_FROM_SELECTED_USER", team);
      commit("UPDATE_USER", state.selectedUser);
      commit("UPDATE_VOLUNTEER", state.selectedUser);
      if (state.selectedUser.id === state.me.id) dispatch("fetchMyInformation");
    },

    async findUserById({ commit }, id: number) {
      const res = await safeCall(this, UserRepository.getUser(this, id));
      if (!res) return;
      commit("SET_SELECTED_USER", res.data);
    },

    async getUserFtRequests({ commit }, userId: number) {
      const res = await safeCall(
        this,
        UserRepository.getUserFtRequests(this, userId),
      );

      if (!res) return;
      const periods = castVolunteerTaskWithDate(res.data);
      commit("SET_SELECTED_USER_FT_REQUESTS", periods);
    },

    async addProfilePicture({ commit }, profilePicture: FormData) {
      const res = await safeCall(
        this,
        UserRepository.addProfilePicture(this, profilePicture),
        { successMessage: "Photo de profil mise à jour ! 🎉" },
      );

      if (!res) return;
      commit("SET_MY_USER", castUserWithDate(res.data));
    },

    getProfilePicture(_, user: MyUserInformationWithProfilePicture) {
      if (!user.profilePicture) return undefined;
      if (user.profilePictureBlob) return user.profilePictureBlob;

      return UserRepository.getProfilePicture(this, user.id);
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
      commit("UPDATE_VOLUNTEER", {
        ...user,
        profilePictureBlob,
      });
    },

    async getVolunteerTasks({ commit }, volunteerId: number) {
      const res = await safeCall(
        this,
        UserRepository.getMobilizationsVolunteerTakePartOf(this, volunteerId),
      );

      if (!res) return;
      const tasks = castVolunteerPlanningTasksWithDate(res.data);
      commit("SET_SELECTED_USER_TASKS", tasks);
    },

    async getVolunteerAssignments({ commit }, userId: number) {
      const res = await safeCall(
        this,
        UserRepository.getVolunteerAssignments(this, userId),
      );

      if (!res) return;
      const periods = castVolunteerTaskWithDate(res.data);
      commit("SET_SELECTED_USER_ASSIGNMENT", periods);
    },

    async getVolunteerAssignmentStats({ commit }, userId: number) {
      const res = await safeCall(
        this,
        UserRepository.getVolunteerAssignmentStats(this, userId),
      );

      if (!res) return;
      commit("SET_SELECTED_USER_ASSIGNMENT_STATS", res.data);
    },
  },
);
