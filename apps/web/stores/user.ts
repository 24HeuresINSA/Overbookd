import type { BreakIdentifier, BreakDefinition } from "@overbookd/planning";
import type { PlanningEvent, PlanningTask } from "@overbookd/assignment";
import type { Permission } from "@overbookd/permission";
import { isHttpError } from "~/utils/http/http-error.utils";
import { castPeriodWithDate } from "~/utils/http/cast-date/period.utils";
import {
  castConsumerWithDate,
  castMyUserInformationWithDate,
  castUserPersonalDataWithDate,
} from "~/utils/http/cast-date/user.utils";
import { castVolunteerPlanningTasksWithDate } from "~/utils/http/cast-date/volunteer-planning.utils";
import type {
  MyUserInformationWithPotentialyProfilePicture,
  UserDataWithPotentialyProfilePicture,
} from "~/utils/user/user-information";
import type { Profile, User, UserPersonalData } from "@overbookd/user";
import { Period } from "@overbookd/time";
import type {
  AssignmentStat,
  Consumer,
  VolunteerWithAssignmentStats,
} from "@overbookd/http";
import { jwtDecode } from "jwt-decode";
import { UserRepository } from "~/repositories/user.repository";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { castPlanningEventsWithDate } from "~/repositories/assignment/planning.repository";
import { PlanningRepository } from "~/repositories/planning.repository";

type State = {
  loggedUser?: MyUserInformationWithPotentialyProfilePicture;
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

type Token = { teams: string[]; permissions: Permission[] };

export const useUserStore = defineStore("user", {
  state: (): State => ({
    loggedUser: undefined,
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
    can:
      () =>
      (permission?: Permission): boolean => {
        if (!permission) return true;

        const { accessToken } = useAuthStore();

        if (!accessToken) return false;
        const decodedToken: Token = jwtDecode(accessToken);

        const isAdmin = decodedToken.teams.includes("admin");
        const hasPermission = decodedToken.permissions.includes(permission);
        return isAdmin || hasPermission;
      },
    isMemberOf:
      ({ loggedUser }) =>
      (team: string): boolean => {
        if (!loggedUser) return false;
        return (
          loggedUser.teams.includes("admin") || loggedUser.teams.includes(team)
        );
      },
  },
  actions: {
    async setSelectedUser(user: UserPersonalData) {
      this.selectedUser = user;
      const res = await UserRepository.getUserFriends(user.id);
      if (isHttpError(res)) return;
      this.selectedUserFriends = res;
    },

    async fetchUser() {
      await this.fetchMyInformations();
      if (!this.loggedUser) return;
      await this.setMyProfilePicture();
    },

    async fetchMyInformations() {
      const res = await UserRepository.getMyUser();
      if (isHttpError(res)) return;
      this.loggedUser = {
        ...this.loggedUser,
        ...castMyUserInformationWithDate(res),
      };
    },

    async approveEndUserLicenceAgreement() {
      const res = await UserRepository.approveEndUserLicenceAgreement();
      if (isHttpError(res)) return;
      sendSuccessNotification("CGU approuvées ! 🎉");
      if (!this.loggedUser) return;
      this.loggedUser = { ...this.loggedUser, hasApprovedEULA: true };
    },

    clearLoggedUser() {
      this.loggedUser = undefined;
    },

    async fetchVolunteers() {
      const res = await UserRepository.getVolunteers();
      if (isHttpError(res)) return;
      this.volunteers = res.map(castUserPersonalDataWithDate);
    },

    async fetchAdherents() {
      const res = await UserRepository.getAdherents();
      if (isHttpError(res)) return;
      this.adherents = res;
    },

    async fetchVolunteersWithAssignmentStats() {
      const res =
        await AssignmentsRepository.fetchVolunteersWithAssignmentStats();
      if (isHttpError(res)) return;
      this.volunteersWithAssignmentStats = res;
    },

    async fetchFriends() {
      const res = await UserRepository.getFriends();
      if (isHttpError(res)) return;
      this.friends = res;
    },

    async fetchMyFriends() {
      if (!this.loggedUser) return;
      const res = await UserRepository.getUserFriends(this.loggedUser.id);
      if (isHttpError(res)) return;
      this.mFriends = res;
    },

    async addFriend(friend: User) {
      const res = await UserRepository.addFriend(friend.id);
      if (isHttpError(res)) return;
      sendSuccessNotification(`${friend.firstname} a été ajouté à tes amis 🎉`);
      this.mFriends = [...this.mFriends, friend];
    },

    async removeFriend(friend: User) {
      const res = await UserRepository.removeFriend(friend.id);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        `${friend.firstname} a été supprimé de tes amis 😯`,
      );
      this.mFriends = this.mFriends.filter((f) => f.id !== friend.id);
    },

    async addFriendToUser(userId: number, friend: User) {
      const res = await UserRepository.addFriendToUser(userId, friend.id);
      if (isHttpError(res)) return;
      sendSuccessNotification(`${friend.firstname} a été ajouté à ses amis 🎉`);
      if (this.selectedUser?.id === userId) {
        this.selectedUserFriends = [...this.selectedUserFriends, res];
      }
    },

    async removeFriendFromUser(userId: number, friend: User) {
      const res = await UserRepository.removeFriendFromUser(userId, friend.id);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        `${friend.firstname} a été supprimé de ses amis😢`,
      );

      if (this.selectedUser?.id === userId) {
        this.selectedUserFriends = this.selectedUserFriends.filter(
          (f) => f.id !== friend.id,
        );
      }
    },

    async fetchPersonalAccountConsumers() {
      const res = await UserRepository.getAllPersonalAccountConsumers();
      if (isHttpError(res)) return;
      this.personalAccountConsumers = res.map(castConsumerWithDate);
    },

    async updateUser(id: number, user: UserPersonalData) {
      const res = await UserRepository.updateUser(id, user);
      if (isHttpError(res)) return;
      sendSuccessNotification("Profil mis à jour ! 🎉");

      const updated = castUserPersonalDataWithDate(res);
      this._updateVolunteerFromList(updated);
      if (this.selectedUser?.id === this.loggedUser?.id) this.fetchUser();
    },

    async updateMyProfile(profile: Partial<Profile>) {
      const res = await UserRepository.updateMyProfile(profile);
      if (isHttpError(res)) return;
      sendSuccessNotification("Profil mis à jour ! 🎉");

      const updated = {
        ...this.loggedUser,
        ...castMyUserInformationWithDate(res),
      };
      this.loggedUser = updated;
      this._updateVolunteerFromList(updated);
    },

    async deleteUser(userId: number) {
      const res = await UserRepository.deleteUser(userId);
      if (isHttpError(res)) return;
      sendSuccessNotification("Utilisateur supprimé ! 🎉");

      this.volunteers = this.volunteers.filter((v) => v.id !== userId);
    },

    async addTeamsToUser(userId: number, teams: string[]) {
      const res = await UserRepository.addTeamsToUser(userId, teams);
      if (isHttpError(res)) return;
      sendSuccessNotification("Equipe(s) ajoutée(s) ! 🎉");

      if (this.selectedUser?.id !== userId) return;
      this.selectedUser = { ...this.selectedUser, teams: res };
      this._updateVolunteerFromList(this.selectedUser);
      if (userId === this.loggedUser?.id) this.fetchMyInformations();
    },

    async removeTeamFromUser(userId: number, team: string) {
      const res = await UserRepository.removeTeamFromUser(userId, team);
      if (isHttpError(res)) return;
      sendSuccessNotification("Equipe retirée ! 🎉");

      if (this.selectedUser?.id !== userId) return;
      this.selectedUser.teams = this.selectedUser.teams.filter(
        (t) => t !== team,
      );
      this._updateVolunteerFromList(this.selectedUser);
      if (userId === this.loggedUser?.id) this.fetchMyInformations();
    },

    async findUserById(id: number) {
      const res = await UserRepository.getUser(id);
      if (isHttpError(res)) return;
      this.selectedUser = castUserPersonalDataWithDate(res);
    },

    async addProfilePicture(profilePicture: FormData) {
      const res = await UserRepository.addProfilePicture(profilePicture);
      if (isHttpError(res)) return;
      sendSuccessNotification("Photo de profil mise à jour ! 🎉");
      this.loggedUser = castMyUserInformationWithDate(res);
    },

    _getProfilePicture(
      user:
        | MyUserInformationWithPotentialyProfilePicture
        | UserDataWithPotentialyProfilePicture,
    ) {
      if (!user.profilePicture) return undefined;
      if (user.profilePictureBlob) return user.profilePictureBlob;

      return UserRepository.getProfilePicture(user.id);
    },

    async setMyProfilePicture() {
      if (!this.loggedUser) return;
      const profilePictureBlob = await this._getProfilePicture(this.loggedUser);
      if (profilePictureBlob instanceof Error) return;

      this.loggedUser = { ...this.loggedUser, profilePictureBlob };
      this._updateVolunteerFromList(this.loggedUser);
    },

    async setSelectedUserProfilePicture() {
      if (!this.selectedUser) return;
      const profilePictureBlob = await this._getProfilePicture(
        this.selectedUser,
      );
      if (profilePictureBlob instanceof Error) return;

      this.selectedUser = { ...this.selectedUser, profilePictureBlob };
      this._updateVolunteerFromList(this.selectedUser);
    },

    async setProfilePicture(user: UserPersonalData) {
      const profilePictureBlob = await this._getProfilePicture(user);
      if (profilePictureBlob instanceof Error) return;

      const updated = { ...user, profilePictureBlob };
      this._updateVolunteerFromList(updated);
    },

    async getVolunteerTasks(volunteerId: number) {
      const res =
        await UserRepository.getMobilizationsVolunteerTakePartOf(volunteerId);
      if (isHttpError(res)) return;
      this.selectedUserTasks = castVolunteerPlanningTasksWithDate(res);
    },

    async getVolunteerAssignments(userId: number) {
      const res = await UserRepository.getVolunteerAssignments(userId);
      if (isHttpError(res)) return;
      this.selectedUserAssignments = castPlanningEventsWithDate(res);
    },

    async getVolunteerAssignmentStats(userId: number) {
      const res = await UserRepository.getVolunteerAssignmentStats(userId);
      if (isHttpError(res)) return;
      this.selectedUserAssignmentStats = res;
    },

    async getVolunteerBreakPeriods(volunteerId: number) {
      const res = await PlanningRepository.getBreakPeriods(volunteerId);
      if (isHttpError(res)) return;
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
      if (isHttpError(res)) return;

      this.selectedUserBreakPeriods = res.map((period) =>
        Period.init(castPeriodWithDate(period)),
      );
    },

    async deleteVolunteerBreakPeriods({ volunteer, period }: BreakIdentifier) {
      const res = await PlanningRepository.removeBreakPeriod(volunteer, period);
      if (isHttpError(res)) return;
      this.selectedUserBreakPeriods = res.map((period) =>
        Period.init(castPeriodWithDate(period)),
      );
    },

    _updateVolunteerFromList(volunteer: UserDataWithPotentialyProfilePicture) {
      this.volunteers = this.volunteers.map((v) =>
        v.id === volunteer.id ? reactive(volunteer) : v,
      );
    },
  },
});
