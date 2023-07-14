import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { BroadcastNotif, Notification, Transfer } from "~/utils/models/repo";
import {
  CompleteUser,
  CompleteUserWithPermissions,
  MyUserInformation,
  User,
  UserCreation,
  UserModification,
  VolunteerAssignmentStat,
  VolunteerTask,
} from "~/utils/models/user";
import { HttpStringified } from "~/utils/types/http";

const resource = "/user";

type Context = { $axios: NuxtAxiosInstance };

export default {
  createUser(context: Context, user: UserCreation) {
    return context.$axios.$post(`${resource}`, user);
  },
  getUser(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<CompleteUser>>(
      `${resource}/${userId}`
    );
  },
  getMyUser(context: Context) {
    return context.$axios.get<HttpStringified<MyUserInformation>>(
      `${resource}/me`
    );
  },
  getAllUsers(context: Context) {
    return context.$axios.get<HttpStringified<CompleteUserWithPermissions[]>>(
      `${resource}`
    );
  },
  getAllPersonnalAccountConsummers(context: Context) {
    return context.$axios.get<HttpStringified<CompleteUser[]>>(
      `${resource}/personnal-account-consummers`
    );
  },
  broadcast(context: Context, data: BroadcastNotif) {
    return context.$axios.post(`${resource}/broadcast`, data);
  },
  transfer(context: Context, data: Transfer) {
    return context.$axios.post(`${resource}/transfer`, data);
  },
  async addProfilePicture(context: Context, profilePicture: FormData) {
    return context.$axios.post<HttpStringified<CompleteUser>>(
      `${resource}/me/profile-picture`,
      profilePicture
    );
  },
  async getProfilePicture(
    context: Context,
    userId: number
  ): Promise<string | undefined> {
    const token = context.$axios.defaults.headers.common["Authorization"];
    if (!token) return undefined;

    const response = await fetch(
      `${process.env.BASE_URL}user/${userId}/profile-picture`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (response.status !== 200) return undefined;

    const url = URL.createObjectURL(await response.blob());
    return url;
  },
  updateNotifications(context: Context, userId: string, data: Notification[]) {
    return context.$axios.put(`${resource}/${userId}`, data);
  },
  updateUser(context: Context, userId: number, userData: UserModification) {
    return context.$axios.put<HttpStringified<CompleteUserWithPermissions>>(
      `${resource}/${userId}`,
      userData
    );
  },
  updateMyUser(context: Context, userData: Partial<UserModification>) {
    return context.$axios.patch<HttpStringified<CompleteUserWithPermissions>>(
      `${resource}/me`,
      userData
    );
  },
  deleteUser(context: Context, userId: number) {
    return context.$axios.delete<void>(`${resource}/${userId}`);
  },
  getFriends(context: Context) {
    return context.$axios.get<HttpStringified<User[]>>("friends");
  },
  getUserFriends(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<User[]>>(`friends/${userId}`);
  },
  addFriend(context: Context, friendId: number) {
    return context.$axios.post<HttpStringified<User>>(`friends`, {
      id: friendId,
    });
  },
  removeFriend(context: Context, friendId: number) {
    return context.$axios.delete<HttpStringified<User>>(`friends/${friendId}`);
  },
  getUserFtRequests(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<VolunteerTask[]>>(
      `${resource}/${userId}/ft-requests`
    );
  },
  getVolunteerAssignments(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<VolunteerTask[]>>(
      `${resource}/${userId}/assignments`
    );
  },
  getVolunteerAssignmentStats(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<VolunteerAssignmentStat[]>>(
      `${resource}/${userId}/assignments/stats`
    );
  },
  getPlanningSubscriptionLink(context: Context) {
    return context.$axios.get<HttpStringified<{ link: string }>>(
      `${resource}/me/planning/subscribe-link`
    );
  },
  getMyPdfPlanning(context: Context) {
    return context.$axios.get<HttpStringified<String>>(
      `${resource}/me/planning`,
      { headers: { accept: "application/pdf" } }
    );
  },
  getPdfPlanning(context: Context, id: number) {
    return context.$axios.get<HttpStringified<String>>(
      `${resource}/${id}/planning`,
      { headers: { accept: "application/pdf" } }
    );
  },
};
