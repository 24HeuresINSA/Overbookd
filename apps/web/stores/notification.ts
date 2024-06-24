import { NotificationRepository } from "~/repositories/notification.repository";
import { isSuccess } from "~/utils/http/api-fetch";

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
      if (!isSuccess(res)) return;
      this.hasNotifications = res.hasNotifications;
    },

    async readNotification() {
      const res = await NotificationRepository.readMyNotification();
      if (!isSuccess(res)) return;
      this.hasNotifications = false;
    },

    received() {
      this.hasNotifications = true;
    },
  },
});
