import { mutationTree, actionTree } from "typed-vuex";

export const state = () => ({
  darkTheme: localStorage["theme"] === "true",
});

export const mutations = mutationTree(state, {
  SET_DARK_THEME(state, isDarkTheme: boolean) {
    state.darkTheme = isDarkTheme;
  },
});

export const actions = actionTree(
  { state },
  {
    toggleDarkTheme({ state, commit }) {
      commit("SET_DARK_THEME", !state.darkTheme);
    },
  }
);
