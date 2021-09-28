import { ActionTree, MutationTree } from "vuex";
import { RootState } from "~/store";

export const state = () => ({
  type: "",
  open: false,
});

export type DialogState = ReturnType<typeof state>;

export const mutations: MutationTree<DialogState> = {
  OPEN_DIALOG: function (state, type: string) {
    state.type = type;
    state.open = true;
  },
  CLOSE_DIALOG: function (state) {
    state.open = false;
  },
};

export const actions: ActionTree<DialogState, RootState> = {
  openDialog: function ({ commit }, payload: string) {
    commit("OPEN_DIALOG", payload);
  },
  closeDialog: function ({ commit }) {
    commit("CLOSE_DIALOG");
  },
};

export interface DialogActions {
  openDialog: string;
  closeDialog: void;
}
