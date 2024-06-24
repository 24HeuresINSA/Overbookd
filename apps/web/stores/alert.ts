import type { Alerts } from "@overbookd/alerts";
import { AlertRepository } from "~/repositories/alert.repository";
import { isSuccess } from "~/utils/http/api-fetch";

type AlertState = {
  alerts: Alerts;
};

export const useAlertStore = defineStore("alert", {
  state: (): AlertState => ({
    alerts: {},
  }),
  actions: {
    async fetchAlerts() {
      const res = await AlertRepository.getMyAlerts();
      if (!isSuccess(res)) return;
      this.alerts = res;
    },

    dismiss(alert: keyof Alerts) {
      this.alerts = { ...this.alerts, [alert]: undefined };
    },
  },
});
