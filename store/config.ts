const configsData = require("../config/configs.json");
import { MutationTree } from "vuex";

export const state = () => ({
  data: {
    data: configsData,
  },
});

export type ConfigState = ReturnType<typeof state>;

export const mutations: MutationTree<ConfigState> = {
  SET_CONFIG(state, data) {
    state.data = data;
  },
};
