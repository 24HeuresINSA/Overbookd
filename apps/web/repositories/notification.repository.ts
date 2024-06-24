import { HttpClient } from "~/utils/http/http-client";

export class NotificationRepository {
  private static readonly basePath = "notifications";

  static hasNotifications() {
    return HttpClient.get<{ hasNotifications: boolean }>(this.basePath);
  }

  static readMyNotification() {
    return HttpClient.delete(this.basePath);
  }
}
