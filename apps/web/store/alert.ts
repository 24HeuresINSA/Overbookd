import { actionTree, mutationTree } from "typed-vuex";
import { PersonnalAccountAlert } from "@overbookd/personnal-account";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repo-factory";

interface AlertState {
  alerts: PersonnalAccountAlert[];
}

const alertRepository = RepoFactory.AlertRepository;

export const state = (): AlertState => ({
  alerts: [],
});

export const mutations = mutationTree(state, {
  SET_ALERTS(state, alerts: PersonnalAccountAlert[]) {
    state.alerts = alerts;
  },
  REMOVE_ALERT(state, alert: PersonnalAccountAlert) {
    state.alerts = state.alerts.filter((a) => a.summary !== alert.summary);
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
    dismiss({ commit }, alert: PersonnalAccountAlert) {
      commit("REMOVE_ALERT", alert);
    },
  },
);
