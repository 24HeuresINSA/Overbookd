import { mutationTree, actionTree } from "typed-vuex";

export const state = () => ({
  type: "",
  open: false,
});

export type DialogState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  OPEN_DIALOG: function (state, type: string) {
    state.type = type;
    state.open = true;
  },
  CLOSE_DIALOG: function (state) {
    state.open = false;
  },
});

export const actions = actionTree(
  { state },
  {
    openDialog: function ({ commit }, payload: string) {
      commit("OPEN_DIALOG", payload);
    },
    closeDialog: function ({ commit }) {
      commit("CLOSE_DIALOG");
    },
  }
);

/**
 * @deprecated
 */
export interface DialogActions {
  openDialog: string;
  closeDialog: void;
}
