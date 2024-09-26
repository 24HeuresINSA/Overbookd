import { NotificationRepository } from "~/repositories/notification.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

type State = {
  hasNotifications: boolean;
};

export const useNotificationStore = defineStore("notification", {
  state: (): State => ({
    hasNotifications: false,
  }),
  actions: {
    async fetchNotifications() {
      const res = await NotificationRepository.hasNotifications();
      if (isHttpError(res)) return;
      this.hasNotifications = res.hasNotifications;
    },

    async readNotification() {
      const res = await NotificationRepository.readMyNotification();
      if (isHttpError(res)) return;
      this.hasNotifications = false;
    },

    received() {
      this.hasNotifications = true;
    },
  },
});
