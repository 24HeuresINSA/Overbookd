import { NuxtAxiosInstance } from '@nuxtjs/axios';
import {
  CompleteUser,
  CompleteUserWithPermissions,
  MyUserInformation,
  User,
  UserCreation,
  UserModification,
  VolunteerAssignmentStat,
  VolunteerTask,
} from '~/utils/models/user';
import { HttpStringified } from '~/utils/types/http';

type Context = { $axios: NuxtAxiosInstance };

export class UserRepository {
  private static readonly basePath = 'users';

  static createUser(context: Context, user: UserCreation) {
    return context.$axios.post<HttpStringified<CompleteUser>>(
      `${this.basePath}`,
      user,
    );
  }

  static getUser(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<CompleteUser>>(
      `${this.basePath}/${userId}`,
    );
  }

  static getMyUser(context: Context) {
    return context.$axios.get<HttpStringified<MyUserInformation>>(
      `${this.basePath}/me`,
    );
  }

  static getAllUsers(context: Context) {
    return context.$axios.get<HttpStringified<CompleteUserWithPermissions[]>>(
      this.basePath,
    );
  }

  static getVolunteers(context: Context) {
    return context.$axios.get<HttpStringified<CompleteUserWithPermissions[]>>(
      `${this.basePath}/volunteers`,
    );
  }

  static getCandidates(context: Context) {
    return context.$axios.get<HttpStringified<CompleteUserWithPermissions[]>>(
      `${this.basePath}/candidates`,
    );
  }

  static getAllPersonnalAccountConsummers(context: Context) {
    return context.$axios.get<HttpStringified<CompleteUser[]>>(
      `${this.basePath}/personnal-account-consummers`,
    );
  }

  static async addProfilePicture(context: Context, profilePicture: FormData) {
    return context.$axios.post<HttpStringified<CompleteUser>>(
      `${this.basePath}/me/profile-picture`,
      profilePicture,
    );
  }

  static async getProfilePicture(
    context: Context,
    userId: number,
  ): Promise<string | undefined> {
    const token = context.$axios.defaults.headers.common['Authorization'];
    if (!token) return undefined;

    const response = await fetch(
      `${process.env.BASE_URL}${this.basePath}/${userId}/profile-picture`,
      {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      },
    );

    if (response.status !== 200) return undefined;

    const url = URL.createObjectURL(await response.blob());
    return url;
  }

  static updateUser(
    context: Context,
    userId: number,
    userData: UserModification,
  ) {
    return context.$axios.put<HttpStringified<CompleteUserWithPermissions>>(
      `${this.basePath}/${userId}`,
      userData,
    );
  }

  static updateMyUser(context: Context, userData: Partial<UserModification>) {
    return context.$axios.patch<HttpStringified<CompleteUserWithPermissions>>(
      `${this.basePath}/me`,
      userData,
    );
  }

  static deleteUser(context: Context, userId: number) {
    return context.$axios.delete<void>(`${this.basePath}/${userId}`);
  }

  static getFriends(context: Context) {
    return context.$axios.get<HttpStringified<User[]>>('friends');
  }

  static getUserFriends(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<User[]>>(`friends/${userId}`);
  }

  static addFriend(context: Context, friendId: number) {
    return context.$axios.post<HttpStringified<User>>('friends', {
      id: friendId,
    });
  }

  static removeFriend(context: Context, friendId: number) {
    return context.$axios.delete<HttpStringified<User>>(`friends/${friendId}`);
  }

  static getUserFtRequests(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<VolunteerTask[]>>(
      `${this.basePath}/${userId}/ft-requests`,
    );
  }

  static getVolunteerAssignments(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<VolunteerTask[]>>(
      `${this.basePath}/${userId}/assignments`,
    );
  }

  static getVolunteerAssignmentStats(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<VolunteerAssignmentStat[]>>(
      `${this.basePath}/${userId}/assignments/stats`,
    );
  }

  static getPlanningSubscriptionLink(context: Context) {
    return context.$axios.get<HttpStringified<{ link: string }>>(
      `${this.basePath}/me/planning/subscribe-link`,
    );
  }

  static getMyPdfPlanning(context: Context) {
    return context.$axios.get<string>(`${this.basePath}/me/planning`, {
      headers: { accept: 'application/pdf' },
    });
  }

  static getPdfPlanning(context: Context, id: number) {
    return context.$axios.get<string>(`${this.basePath}/${id}/planning`, {
      headers: { accept: 'application/pdf' },
    });
  }
}
