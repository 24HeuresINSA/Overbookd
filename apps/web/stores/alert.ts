import type { Alerts } from "@overbookd/alerts";
import { isHttpError } from "~/utils/http/api-fetch";

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
