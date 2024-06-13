import type { PlanningEvent } from "@overbookd/assignment";
import type {
  AssignmentStat,
  Consumer,
  PlanningTask,
  VolunteerWithAssignmentStats,
} from "@overbookd/http";
import { Period } from "@overbookd/period";
import type { Permission } from "@overbookd/permission";
import type { BreakDefinition, BreakIdentifier } from "@overbookd/planning";
import type {
  MyUserInformation,
  Profile,
  User,
  UserPersonalData,
} from "@overbookd/user";
import { isSuccess } from "~/utils/http/api-fetch";
import { castPeriodWithDate } from "~/utils/http/period";
import {
  castConsumerWithDate,
  castMyUserInformationWithoutDate,
  castUserPersonalDataWithDate,
} from "~/utils/http/user";
import { castVolunteerPlanningTasksWithDate } from "~/utils/http/volunteer-planning";
import type {
  MyUserInformationWithProfilePicture,
  UserDataWithPotentialyProfilePicture,
  UserPersonalDataWithProfilePicture,
} from "~/utils/user/user-information";
import { sendNotification } from "~/utils/notification/send-notification";

type State = {
  loggedUser?: MyUserInformation | MyUserInformationWithProfilePicture;
  users: UserDataWithPotentialyProfilePicture[];
  selectedUser?: UserDataWithPotentialyProfilePicture;
  selectedUserFriends: User[];
  selectedUserAssignments: PlanningEvent[];
  selectedUserBreakPeriods: Period[];
  selectedUserTasks: PlanningTask[];
  selectedUserAssignmentStats: AssignmentStat[];
  personalAccountConsumers: Consumer[];
  volunteers: UserDataWithPotentialyProfilePicture[];
  volunteersWithAssignmentStats: VolunteerWithAssignmentStats[];
  adherents: User[];
  friends: User[];
  mFriends: User[];
};

export const useUserStore = defineStore("user", {
  state: (): State => ({
    loggedUser: undefined,
    users: [],
    selectedUser: undefined,
    selectedUserFriends: [],
    selectedUserAssignments: [],
    selectedUserBreakPeriods: [],
    selectedUserTasks: [],
    selectedUserAssignmentStats: [],
    personalAccountConsumers: [],
    volunteers: [],
    volunteersWithAssignmentStats: [],
    adherents: [],
    friends: [],
    mFriends: [],
  }),
  getters: {
    me: (state) => {
      if (!state.loggedUser) throw new Error("No logged user");
      return state.loggedUser;
    },
    can: (state) => (permission?: Permission) => {
      if (!permission) return true;
      if (!state.loggedUser) return false;
      return (
        state.loggedUser.teams.includes("admin") ||
        state.loggedUser.permissions.includes(permission) ||
        false
      );
    },
    isMemberOf:
      ({ loggedUser }) =>
        (team: string) => {
          if (!loggedUser) return false;
          return (
            loggedUser.teams.includes("admin") || loggedUser.teams.includes(team)
          );
        },
  },
  actions: {
    async setSelectedUser(user: UserPersonalData) {
      const res = await UserRepository.getUserFriends(user.id);
      if (!isSuccess(res)) return;
      this.selectedUserFriends = res;
      this.selectedUser = user;
    },

    async fetchUser() {
      await this.fetchMyInformation();
      if (!this.loggedUser) return;
      await this.setMyProfilePicture();
    },

    async fetchMyInformation() {
      const res = await UserRepository.getMyUser();
      if (!isSuccess(res)) return;
      this.loggedUser = castMyUserInformationWithoutDate(res);
    },

    clearLoggedUser() {
      this.loggedUser = undefined;
    },

    async fetchUsers() {
      const res = await UserRepository.getAllUsers();
      if (!isSuccess(res)) return;
      this.users = res.map(castUserPersonalDataWithDate);
    },

    async fetchVolunteers() {
      const res = await UserRepository.getVolunteers();
      if (!isSuccess(res)) return;
      this.volunteers = res.map(castUserPersonalDataWithDate);
    },

    async fetchAdherents() {
      const res = await UserRepository.getAdherents();
      if (!isSuccess(res)) return;
      this.adherents = res;
    },

    async fetchVolunteersWithAssignmentStats() {
      const res =
        await AssignmentsRepository.fetchVolunteersWithAssignmentStats();
      if (!isSuccess(res)) return;
      this.volunteersWithAssignmentStats = res;
    },

    async fetchFriends() {
      const res = await UserRepository.getFriends();
      if (!isSuccess(res)) return;
      this.friends = res;
    },

    async fetchMyFriends() {
      const res = await UserRepository.getUserFriends(this.me.id);
      if (!isSuccess(res)) return;
      this.mFriends = res;
    },

    async addFriend(friend: User) {
      const res = await UserRepository.addFriend(friend.id);
      if (!isSuccess(res)) return;
      sendNotification(`${friend.firstname} a été ajouté à tes amis 🎉`);
      this.mFriends = [...this.mFriends, friend];
    },

    async removeFriend(friend: User) {
      const res = await UserRepository.removeFriend(friend.id);
      if (!isSuccess(res)) return;
      sendNotification(`${friend.firstname} a été supprimé de tes amis`);
      this.mFriends = this.mFriends.filter((f) => f.id !== friend.id);
    },

    async addFriendToSelectedUser(friend: User) {
      if (!this.selectedUser) return;
      const res = await UserRepository.addFriendToUser(
        this.selectedUser.id,
        friend.id,
      );
      if (!isSuccess(res)) return;
      sendNotification(
        `${friend.firstname} a été ajouté aux amis de ${this.selectedUser.firstname} 🎉`,
      );
      this.selectedUserFriends = [...this.selectedUserFriends, res];
    },

    async removeFriendFromSelectedUser(friend: User) {
      if (!this.selectedUser) return;
      const res = await UserRepository.removeFriendFromUser(
        this.selectedUser.id,
        friend.id,
      );
      if (!isSuccess(res)) return;
      sendNotification(
        `${friend.firstname} a été supprimé des amis de ${this.selectedUser.firstname}`,
      );
      this.selectedUserFriends = this.selectedUserFriends.filter(
        (f) => f.id !== friend.id,
      );
    },

    async fetchPersonalAccountConsumers() {
      const res = await UserRepository.getAllPersonalAccountConsumers();
      if (!isSuccess(res)) return;
      this.personalAccountConsumers = res.map(castConsumerWithDate);
    },

    async updateUser(id: number, user: UserPersonalData) {
      const res = await UserRepository.updateUser(id, user);
      if (!isSuccess(res)) return;
      sendNotification("Profil mis à jour ! 🎉");

      const updated = castUserPersonalDataWithDate(res);
      this.users = this.users.map((u) => (u.id === id ? updated : u));
      this.volunteers = this.volunteers.map((v) => (v.id === id ? updated : v));
      if (this.selectedUser?.id === this.me.id) this.fetchUser();
    },

    async updateComment(comment: string) {
      const res = await UserRepository.updateMyProfile({ comment });
      if (!isSuccess(res)) return;
      sendNotification("Commentaire mis à jour ! 🎉");

      const updated = castMyUserInformationWithoutDate(res);
      this.loggedUser = updated;
      this.users = this.users.map((u) => (u.id === this.me.id ? updated : u));
    },

    async updateMyProfile(profile: Profile) {
      const res = await UserRepository.updateMyProfile(profile);
      if (!isSuccess(res)) return;
      sendNotification("Profil mis à jour ! 🎉");

      const updated = castMyUserInformationWithoutDate(res);
      this.loggedUser = updated;
      this.users = this.users.map((u) => (u.id === this.me.id ? updated : u));
    },

    async deleteUser(userId: number) {
      const res = await UserRepository.deleteUser(userId);
      if (!isSuccess(res)) return;
      sendNotification("Utilisateur supprimé ! 🎉");

      this.users = this.users.filter((u) => u.id !== userId);
      this.volunteers = this.volunteers.filter((v) => v.id !== userId);
    },

    async addTeamsToSelectedUser(teams: string[]) {
      if (!this.selectedUser) return;
      const res = await UserRepository.addTeamsToUser(
        this.selectedUser.id,
        teams,
      );
      if (!isSuccess(res)) return;
      sendNotification("Equipe(s) ajoutée(s) ! 🎉");

      this.selectedUser = { ...this.selectedUser, teams: res };
      this.users = this.users.map((u) =>
        u.id === this.selectedUser?.id ? this.selectedUser : u,
      );
      this.volunteers = this.volunteers.map((v) =>
        v.id === this.selectedUser?.id ? this.selectedUser : v,
      );
      if (this.selectedUser.id === this.me.id) this.fetchMyInformation();
    },

    async removeTeamFromSelectedUser(team: string) {
      if (!this.selectedUser) return;
      const res = await UserRepository.removeTeamFromUser(
        this.selectedUser.id,
        team,
      );
      if (!isSuccess(res)) return;
      sendNotification("Equipe retirée ! 🎉");

      this.selectedUser.teams = this.selectedUser.teams.filter(
        (t) => t !== team,
      );
      this.users = this.users.map((u) =>
        u.id === this.selectedUser?.id ? this.selectedUser : u,
      );
      this.volunteers = this.volunteers.map((v) =>
        v.id === this.selectedUser?.id ? this.selectedUser : v,
      );
      if (this.selectedUser.id === this.me.id) this.fetchMyInformation();
    },

    async findUserById(id: number) {
      const res = await UserRepository.getUser(id);
      if (!isSuccess(res)) return;
      this.selectedUser = castUserPersonalDataWithDate(res);
    },

    async addProfilePicture(profilePicture: FormData) {
      const res = await UserRepository.addProfilePicture(profilePicture);
      if (!isSuccess(res)) return;
      sendNotification("Photo de profil mise à jour ! 🎉");
      this.loggedUser = castMyUserInformationWithoutDate(res);
    },

    getProfilePicture(
      user:
        | MyUserInformationWithProfilePicture
        | UserPersonalDataWithProfilePicture,
    ) {
      if (!user.profilePicture) return undefined;
      if (user.profilePictureBlob) return user.profilePictureBlob;

      return UserRepository.getProfilePicture(user.id);
    },

    async setMyProfilePicture() {
      if (!this.loggedUser) return;
      const profilePictureBlob = await this.getProfilePicture(this.loggedUser);
      if (profilePictureBlob instanceof Error) return;

      this.loggedUser = { ...this.loggedUser, profilePictureBlob };
    },

    async setSelectedUserProfilePicture() {
      if (!this.selectedUser) return;
      const profilePictureBlob = await this.getProfilePicture(
        this.selectedUser,
      );
      if (profilePictureBlob instanceof Error) return;

      this.selectedUser = {
        ...this.selectedUser,
        profilePictureBlob,
      };
    },

    async setProfilePicture(user: UserPersonalData) {
      const profilePictureBlob = await this.getProfilePicture(user);
      if (profilePictureBlob instanceof Error) return;

      const updated = { ...user, profilePictureBlob };
      this.users = this.users.map((u) => (u.id === user.id ? updated : u));
      this.volunteers = this.volunteers.map((v) =>
        v.id === user.id ? updated : v,
      );
    },

    async getVolunteerTasks(volunteerId: number) {
      const res =
        await UserRepository.getMobilizationsVolunteerTakePartOf(volunteerId);
      if (!isSuccess(res)) return;
      this.selectedUserTasks = castVolunteerPlanningTasksWithDate(res);
    },

    async getVolunteerAssignments(userId: number) {
      const res = await UserRepository.getVolunteerAssignments(userId);
      if (!isSuccess(res)) return;
      this.selectedUserAssignments = castPlanningEventsWithDate(res);
    },

    async getVolunteerAssignmentStats(userId: number) {
      const res = await UserRepository.getVolunteerAssignmentStats(userId);
      if (!isSuccess(res)) return;
      this.selectedUserAssignmentStats = res;
    },

    async getVolunteerBreakPeriods(volunteerId: number) {
      const res = await PlanningRepository.getBreakPeriods(volunteerId);
      if (!isSuccess(res)) return;
      this.selectedUserBreakPeriods = res.map((period) =>
        Period.init(castPeriodWithDate(period)),
      );
    },

    async addVolunteerBreakPeriods({
      volunteer,
      during: { start, duration },
    }: BreakDefinition) {
      const during = { start, durationInHours: duration.inHours };
      const res = await PlanningRepository.addBreakPeriod(volunteer, during);
      if (!isSuccess(res)) return;

      this.selectedUserBreakPeriods = res.map((period) =>
        Period.init(castPeriodWithDate(period)),
      );
    },

    async deleteVolunteerBreakPeriods({ volunteer, period }: BreakIdentifier) {
      const res = await PlanningRepository.removeBreakPeriod(volunteer, period);
      if (!isSuccess(res)) return;
      this.selectedUserBreakPeriods = res.map((period) =>
        Period.init(castPeriodWithDate(period)),
      );
    },
  },
});
