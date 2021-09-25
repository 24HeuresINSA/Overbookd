const configsData = require("../config/configs.json");

export const state = () => ({
  data: {
    data: configsData,
  },
});

export const mutations = {
  setConfig(state, data) {
    state.data = data;
  },
};
