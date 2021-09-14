export const config = () => ({
  data: [],
});

export const mutations = {
  setConfig(config, data) {
    config.data = data;
  },
};
