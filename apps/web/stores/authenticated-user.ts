import type { Permission } from "@overbookd/permission";
import { isHttpError } from "~/utils/http/http-error.utils";
import { castMyUserInformationWithDate } from "~/utils/http/cast-date/user.utils";
import type {
  MyUserInformationWithPotentialyProfilePicture,
  UserDataWithPotentialyProfilePicture,
} from "~/utils/user/user-information";
import type { Profile } from "@overbookd/user";
import { jwtDecode } from "jwt-decode";
import { UserRepository } from "~/repositories/user.repository";
import type { Membership } from "@overbookd/registration";
import { ADMIN } from "@overbookd/team-constants";

type State = {
  loggedUser?: MyUserInformationWithPotentialyProfilePicture;
  synced: boolean;
};

type Token = { teams: string[]; permissions: Permission[] };

export const useMyStore = defineStore("authenticated-user", {
  state: (): State => ({
    loggedUser: undefined,
    synced: false,
  }),
  getters: {
    can:
      () =>
      (permission?: Permission): boolean => {
        if (!permission) return true;

        const accessToken = useCookie(ACCESS_TOKEN);
        if (!accessToken.value) return false;
        const decodedToken: Token = jwtDecode(accessToken.value);

        const isAdmin = decodedToken.teams.includes(ADMIN);
        const hasPermission = decodedToken.permissions.includes(permission);
        return isAdmin || hasPermission;
      },

    isMemberOf:
      ({ loggedUser }) =>
      (team: string): boolean => {
        if (!loggedUser) return false;
        return (
          loggedUser.teams.includes(ADMIN) || loggedUser.teams.includes(team)
        );
      },
  },

  actions: {
    async fetchMyInformations() {
      const res = await UserRepository.getMyUser();
      if (isHttpError(res)) return;
      this.loggedUser = {
        ...this.loggedUser,
        ...castMyUserInformationWithDate(res),
      };
    },

    async sync() {
      return UserRepository.userSync()
        .then(() => (this.synced = true))
        .catch((_: unknown) => (this.synced = false));
    },

    clear() {
      this.loggedUser = undefined;
      this.synced = false;
    },

    async approveEndUserLicenceAgreement() {
      const res = await UserRepository.approveEndUserLicenceAgreement();
      if (isHttpError(res)) return;
      sendSuccessNotification("CGU approuvées ! 🎉");
      if (!this.loggedUser) return;
      this.loggedUser = { ...this.loggedUser, hasApprovedEULA: true };
    },

    async signVolunteerCharter() {
      const res = await UserRepository.signVolunteerCharter();
      if (isHttpError(res)) return;
      sendSuccessNotification("Charte bénévole signée ! 🎉");
      if (!this.loggedUser) return;
      this.loggedUser = { ...this.loggedUser, hasSignedVolunteerCharter: true };
    },

    clearLoggedUser() {
      this.loggedUser = undefined;
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
    },

    setLoggedUserMembershipApplication(application: Membership) {
      if (!this.loggedUser) return;
      this.loggedUser = {
        ...this.loggedUser,
        membershipApplication: application,
      };
    },
  },
});
