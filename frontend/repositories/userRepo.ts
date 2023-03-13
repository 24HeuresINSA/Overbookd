import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { BroadcastNotif, Notification, Transfer } from "~/utils/models/repo";
import {
  CompleteUser,
  CompleteUserWithPermissions,
  PeriodWithFtId,
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
    return context.$axios.get<HttpStringified<PeriodWithFtId[]>>(
      `user/${userId}/ft-requests`
    );
  },
};
