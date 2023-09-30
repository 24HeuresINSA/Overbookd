import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";

const notificationRepository = RepoFactory.NotificationRepository;

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
        notificationRepository.getMyNotifications(this),
      );
      if (!res) return;
      commit("SET_NOTIFICATIONS", res.data);
    },
    readNotification({ commit }) {
      commit("SET_NOTIFICATIONS", false);
    },
  },
);
