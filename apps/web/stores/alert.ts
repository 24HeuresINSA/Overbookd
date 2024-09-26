import type { Alerts } from "@overbookd/alerts";
import { AlertRepository } from "~/repositories/alert.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

type State = {
  alerts: Alerts;
};

export const useAlertStore = defineStore("alert", {
  state: (): State => ({
    alerts: {},
  }),
  actions: {
    async fetchAlerts() {
      const res = await AlertRepository.getMyAlerts();
      if (isHttpError(res)) return;
      this.alerts = res;
    },

    dismiss(alert: keyof Alerts) {
      this.alerts = { ...this.alerts, [alert]: undefined };
    },
  },
});
