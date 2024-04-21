import { Context } from "./context";

export class NotificationRepository {
  private static readonly basePath = "notifications";

  static hasNotifications(context: Context) {
    return context.$axios.get<{ hasNotifications: boolean }>(this.basePath);
  }

  static readMyNotification(context: Context) {
    return context.$axios.delete(this.basePath);
  }
}
