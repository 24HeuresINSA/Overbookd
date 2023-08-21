import { actionTree, mutationTree } from "typed-vuex";
import { SnackNotif } from "~/utils/models/store";

export const state = () => ({
  queue: [] as SnackNotif[],
});

export type NotificationState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  ADD_NOTIFICATION: function (state, payload: SnackNotif) {
    // generate id
    let count = 0;
    state.queue.map((i) => {
      count += i.id!;
    });
    payload.id = count + 1;
    //push notifications
    state.queue = [payload, ...state.queue];
  },
  POP_NOTIFICATION: function (state, payload: number) {
    state.queue = state.queue.filter((i) => {
      return i.id != payload;
    });
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    pushNotification: function ({ commit }, payload: SnackNotif) {
      commit("ADD_NOTIFICATION", payload);
    },
    popNotification: function ({ commit }, payload: number) {
      commit("POP_NOTIFICATION", payload);
    },
  }
);
