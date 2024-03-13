import { actionTree, mutationTree } from "typed-vuex";
import { NotificationRepository } from "~/repositories/notification.repository";
import { safeCall } from "~/utils/api/calls";

interface NotificationState {
  hasNotifications: boolean;
}

export const state = (): NotificationState => ({
  hasNotifications: false,
});

export const mutations = mutationTree(state, {
  SET_NOTIFICATIONS(state, hasNotifications: boolean) {
    state.hasNotifications = hasNotifications;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchNotifications({ commit }) {
      const res = await safeCall(
        this,
        NotificationRepository.hasNotifications(this),
      );
      if (!res) return;
      commit("SET_NOTIFICATIONS", res.data.hasNotifications);
    },
    async readNotification({ commit }) {
      const res = await safeCall(
        this,
        NotificationRepository.readMyNotification(this),
      );
      if (!res) return;
      commit("SET_NOTIFICATIONS", false);
    },
    received({ commit }) {
      commit("SET_NOTIFICATIONS", true);
    },
  },
);
