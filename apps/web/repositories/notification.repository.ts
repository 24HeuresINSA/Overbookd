import { NuxtAxiosInstance } from "@nuxtjs/axios";

export type Context = { $axios: NuxtAxiosInstance };

export class NotificationRepository {
  private static readonly basePath = "notifications";

  static hasNotifications(context: Context) {
    return context.$axios.get<boolean>(this.basePath);
  }

  static readMyNotification(context: Context) {
    return context.$axios.delete(this.basePath);
  }
}
