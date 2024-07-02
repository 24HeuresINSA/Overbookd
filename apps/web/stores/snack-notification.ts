import { ONE_SECOND_IN_MS } from "@overbookd/period";

const SUCCESS = "success";
const FAILURE = "error";
type NotificationType = typeof SUCCESS | typeof FAILURE;

export type SnackNotification = {
  message: string;
  timeout: number;
  type: NotificationType;
};

export const DEFAULT_SNACK_TIMEOUT = 3 * ONE_SECOND_IN_MS;

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
