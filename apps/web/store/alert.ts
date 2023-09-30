import { actionTree, mutationTree } from "typed-vuex";
import {
  IAlertAboutPersonnalAccount,
  PersonnalAccountAlert,
} from "@overbookd/personnal-account";
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
  SET_ALERTS(state, alerts: IAlertAboutPersonnalAccount[]) {
    state.alerts = alerts.map(
      ({ summary, balance }) => new PersonnalAccountAlert(summary, balance),
    );
  },
  REMOVE_ALERT(state, alert: IAlertAboutPersonnalAccount) {
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
    dismiss({ commit }, alert: IAlertAboutPersonnalAccount) {
      commit("REMOVE_ALERT", alert);
    },
  },
);
