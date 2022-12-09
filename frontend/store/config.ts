import { actionTree, getterTree, mutationTree } from "typed-vuex";
import configRepo from "../repositories/configRepo";
import { safeCall } from "~/utils/api/calls";

export const state = () => ({
  data: {
    data: {} as any,
  },
});

export const getters = getterTree(state, {
  getConfig: (state) => (key: string) => {
    if (state?.data?.data) {
      const config = state.data.data.find((o: any) => o.key === key);
      if (config) {
        return config.value;
      } else {
        return;
      }
    }
  },
});

export type ConfigState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_CONFIG(state, data) {
    state.data = data;
  },
  SET_ONE_CONFIG(state, data: { key: string; value: any }) {
    const config = state.data.data.find((o: any) => o.key == data.key);
    if (config) {
      config.value = data.value;
    } else {
      state.data.data.push(data);
    }
  },
});

export const actions = actionTree(
  { state },
  {
    async setConfig({ commit }, data: { key: string; value: any }) {
      await safeCall(this, configRepo.setConfig(this, data));
      commit("SET_ONE_CONFIG", data);
    },
  }
);
