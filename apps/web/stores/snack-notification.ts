import {
  DEFAULT_SNACK_TIMEOUT,
  FAILURE,
  INFO,
  SUCCESS,
  type NotificationType,
  type SnackNotification,
} from "~/utils/snack-notification";

type State = {
  queue: SnackNotification[];
};

export const useSnackNotificationStore = defineStore("snack-notification", {
  state: (): State => ({
    queue: [],
  }),
  actions: {
    pushNotification(
      type: NotificationType,
      message: string | string[],
      timeout: number = DEFAULT_SNACK_TIMEOUT,
    ) {
      const stringMessage = Array.isArray(message)
        ? message.join(" - ")
        : message;
      const notification = { type, message: stringMessage, timeout };
      this.queue = [...this.queue, notification];
    },

    popFirstNotification() {
      if (this.queue.length === 0) return;
      this.queue = this.queue.slice(1);
    },
  },
});

export function sendSuccessNotification(
  message: string | string[],
  duration?: number,
) {
  const { pushNotification } = useSnackNotificationStore();
  pushNotification(SUCCESS, message, duration);
}

export function sendFailureNotification(
  message: string | string[],
  duration?: number,
) {
  const { pushNotification } = useSnackNotificationStore();
  pushNotification(FAILURE, message, duration);
}

export function sendInfoNotification(
  message: string | string[],
  duration?: number,
) {
  const { pushNotification } = useSnackNotificationStore();
  pushNotification(INFO, message, duration);
}
