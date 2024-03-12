import { actionTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import { Alerts } from "@overbookd/alerts";
import { AlertRepository } from "~/repositories/alert.repository";

interface AlertState {
  alerts: Alerts;
}

export const state = (): AlertState => ({
  alerts: {},
});

export const mutations = mutationTree(state, {
  SET_ALERTS(state, alerts: Alerts) {
    state.alerts = alerts;
  },
  REMOVE_ALERT(state, alert: keyof Alerts) {
    state.alerts = { ...state.alerts, [alert]: undefined };
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchAlerts({ commit }) {
      const res = await safeCall(this, AlertRepository.getMyAlerts(this));
      if (!res) return;
      commit("SET_ALERTS", res.data);
    },

    dismiss({ commit }, alert: keyof Alerts) {
      commit("REMOVE_ALERT", alert);
    },
  },
);
