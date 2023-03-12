import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  BroadcastNotif,
  FriendRequestData,
  Notification,
  Transfer,
} from "~/utils/models/repo";
import {
  CompleteUser,
  CompleteUserWithPermissions,
  Friend,
  User,
  UserCreation,
  UserModification,
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
    return context.$axios.get(`${resource}/me`);
  },
  getAllUsers(context: Context) {
    return context.$axios.get<HttpStringified<CompleteUserWithPermissions[]>>(
      `${resource}`
    );
  },
  getAllUsernames(context: Context) {
    return context.$axios.get(`${resource}/all`);
  },
  getAllUsernamesWithCP(context: Context) {
    return context.$axios.get(`${resource}/all/cp`);
  },
  broadcast(context: Context, data: BroadcastNotif) {
    return context.$axios.post(`${resource}/broadcast`, data);
  },
  transfer(context: Context, data: Transfer) {
    return context.$axios.post(`${resource}/transfer`, data);
  },
  addPP(context: Context, data: any) {
    return context.$axios.post(`${resource}/pp`, data);
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
  deleteUser(context: Context, userId: number) {
    return context.$axios.delete<void>(`${resource}/${userId}`);
  },
  isMigrated(context: Context) {
    return context.$axios.get(`${resource}/isMigrated`);
  },
  // /**
  //  * @deprecated
  //  * @param context
  //  * @param data
  //  */
  // sendFriendRequest(context: Context, data: FriendRequestData) {
  //   return context.$axios.put(
  //     `${resource}/notification/${data.to.lastname}/${data.to.firstname}`,
  //     data.data
  //   );
  // },
  sendFriendRequestByKeycloakID(context: Context, data: FriendRequestData) {
    return context.$axios.put(
      `${resource}/notificationKeycloakID/${data.to}`, // TODO ask tom about new name
      data.data
    );
  },
  acceptSelection(context: Context, timeslotsIDS: String[]) {
    return context.$axios.post(`${resource}/availabilities`, timeslotsIDS);
  },
  removeAvailability(
    context: Context,
    data: { userID: string; timeslotID: string }
  ) {
    return context.$axios.post(`${resource}/removeAvailability`, data);
  },
  addAvailabilityToUser(
    context: Context,
    data: { userID: string; timeslotID: string }
  ) {
    return context.$axios.post(`${resource}/addAvailabilityToUser`, data);
  },
  getFriends(context: Context) {
    return context.$axios.get<HttpStringified<Friend[]>>("friends");
  },
  getUserFriends(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<Friend[]>>(`friends/${userId}`);
  },
  addFriend(context: Context, friendId: number) {
    return context.$axios.post<HttpStringified<Friend>>(`friends`, {
      id: friendId,
    });
  },
  removeFriend(context: Context, friendId: number) {
    return context.$axios.delete<HttpStringified<Friend>>(
      `friends/${friendId}`
    );
  },
  async getPP(userPP: String, token: string): Promise<String> {
      const response = await fetch(
        `${process.env.BASE_URL}user/pp/${userPP}`,
        {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        const url = URL.createObjectURL(await response.blob());
        return url;
      }
      return "";
    }
  }
