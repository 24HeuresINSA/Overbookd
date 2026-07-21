import { isHttpError } from "~/utils/http/http-error.utils";
import {
  castConsumerWithDate,
  castUserPersonalDataWithDate,
} from "~/utils/http/cast-date/user.utils";
import type {
  MyUserInformationWithPotentialyProfilePicture,
  UserDataWithPotentialyProfilePicture,
} from "~/utils/user/user-information";
import type {
  User,
  UserPersonalData,
  UserUpdateForm,
  UserWithTeams,
} from "@overbookd/user";
import type { Consumer, VolunteerWithAssignmentStats } from "@overbookd/http";
import { UserRepository } from "~/repositories/user.repository";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";

type State = {
  selectedUser?: UserDataWithPotentialyProfilePicture;
  selectedUserFriends: UserWithTeams[];
  personalAccountConsumers: Consumer[];
  volunteers: UserDataWithPotentialyProfilePicture[];
  volunteersWithAssignmentStats: VolunteerWithAssignmentStats[];
  adherents: User[];
  potentialFriends: User[];
  myFriends: User[];
};

export const useUserStore = defineStore("user", {
  state: (): State => ({
    selectedUser: undefined,
    selectedUserFriends: [],
    personalAccountConsumers: [],
    volunteers: [],
    volunteersWithAssignmentStats: [],
    adherents: [],
    potentialFriends: [],
    myFriends: [],
  }),
  actions: {
    setSelectedUser(user: UserPersonalData) {
      this.selectedUser = user;
    },

    async fetchSelectedUserFriends() {
      if (!this.selectedUser) return (this.selectedUserFriends = []);
      const res = await UserRepository.getUserFriends(this.selectedUser.id);
      if (isHttpError(res)) return;
      this.selectedUserFriends = res;
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

    async fetchAllVolunteersWithAssignmentStats() {
      const res =
        await AssignmentsRepository.fetchAllVolunteersWithAssignmentStats();
      if (isHttpError(res)) return;
      this.volunteersWithAssignmentStats = res;
    },

    async fetchFriendsFor(userId: number) {
      const res = await UserRepository.getFriendsFor(userId);
      if (isHttpError(res)) return;
      this.potentialFriends = res;
    },

    async fetchMyFriends() {
      const loggedUser = useMyStore().loggedUser;
      if (!loggedUser) return;
      const res = await UserRepository.getUserFriends(loggedUser.id);
      if (isHttpError(res)) return;
      this.myFriends = res;
    },

    async addFriend(friend: User) {
      const res = await UserRepository.addFriend(friend.id);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        `${friend.firstName} a été ajouté à tes ami·e·s 🎉`,
      );
      this.myFriends = [...this.myFriends, res];
      this.potentialFriends = this.potentialFriends.filter(
        ({ id }) => id !== res.id,
      );
    },

    async removeFriend(friend: User) {
      const res = await UserRepository.removeFriend(friend.id);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        `${friend.firstName} a été supprimé de tes ami·e·s 😯`,
      );
      this.myFriends = this.myFriends.filter(({ id }) => id !== friend.id);
      this.potentialFriends = [...this.potentialFriends, friend];
    },

    async addFriendToUser(userId: number, friend: User) {
      const res = await UserRepository.addFriendToUser(userId, friend.id);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        `${friend.firstName} a été ajouté à ses ami·e·s 🎉`,
      );
      if (this.selectedUser?.id === userId) {
        this.selectedUserFriends = [...this.selectedUserFriends, res];
        this.potentialFriends = this.potentialFriends.filter(
          ({ id }) => id !== res.id,
        );
      }
    },

    async removeFriendFromUser(userId: number, friend: User) {
      const res = await UserRepository.removeFriendFromUser(userId, friend.id);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        `${friend.firstName} a été supprimé de ses ami·e·s 😢`,
      );

      if (this.selectedUser?.id === userId) {
        this.selectedUserFriends = this.selectedUserFriends.filter(
          ({ id }) => id !== friend.id,
        );
        this.potentialFriends = [...this.potentialFriends, friend];
      }
    },

    async fetchPersonalAccountConsumers() {
      const res = await UserRepository.getAllPersonalAccountConsumers();
      if (isHttpError(res)) return;
      this.personalAccountConsumers = res.map(castConsumerWithDate);
    },

    async updateUser(id: number, user: UserUpdateForm) {
      const res = await UserRepository.updateUser(id, user);
      if (isHttpError(res)) return;
      sendSuccessNotification("Profil mis à jour ! 🎉");

      const updated = castUserPersonalDataWithDate(res);
      this._updateVolunteerFromList(updated);

      const myStore = useMyStore();
      if (this.selectedUser?.id === myStore.loggedUser?.id)
        myStore.fetchMyInformations();
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

      const myStore = useMyStore();
      if (this.selectedUser?.id === myStore.loggedUser?.id)
        myStore.fetchMyInformations();
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

      const myStore = useMyStore();
      if (this.selectedUser?.id === myStore.loggedUser?.id)
        myStore.fetchMyInformations();
    },

    async findUserById(id: number) {
      const res = await UserRepository.getUser(id);
      if (isHttpError(res)) return;
      this.selectedUser = castUserPersonalDataWithDate(res);
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

    _updateVolunteerFromList(volunteer: UserDataWithPotentialyProfilePicture) {
      this.volunteers = this.volunteers.map((v) =>
        v.id === volunteer.id ? reactive(volunteer) : v,
      );
    },
  },
});
