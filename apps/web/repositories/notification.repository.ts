import { NuxtAxiosInstance } from "@nuxtjs/axios";

export type Context = { $axios: NuxtAxiosInstance };

export class NotificationRepository {
  private static readonly basePath = "notifications";

  static getMyNotifications(context: Context) {
    return context.$axios.get<boolean>(this.basePath);
  }
}
