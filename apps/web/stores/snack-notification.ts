import { ONE_SECOND_IN_MS } from "@overbookd/period";

export type SnackNotification = {
  message: string;
  timeout: number;
};

export const DEFAULT_SNACK_TIMEOUT = 3 * ONE_SECOND_IN_MS;

type State = {
  queue: SnackNotification[];
};

export const useSnackNotificationStore = defineStore("snackNotification", {
  state: (): State => ({
    queue: [],
  }),
  actions: {
    pushNotification(message: string, timeout: number = DEFAULT_SNACK_TIMEOUT) {
      const notification = { message, timeout };
      this.queue = [...this.queue, notification];
    },
    popFirstNotification() {
      if (this.queue.length === 0) return;
      this.queue = this.queue.slice(1);
    },
  },
});
