import { actionTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repo-factory";
import { Alerts } from "@overbookd/alerts";

interface AlertState {
  alerts: Alerts;
}

const alertRepository = RepoFactory.AlertRepository;

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
      const res = await safeCall(this, alertRepository.getMyAlerts(this));
      if (!res) return;
      commit("SET_ALERTS", res.data);
    },

    dismiss({ commit }, alert: keyof Alerts) {
      commit("REMOVE_ALERT", alert);
    },
  },
);
