import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { Configuration } from "~/utils/models/Configuration";
import { safeCall } from "~/utils/api/calls";

const configurationRepo = RepoFactory.configurationRepo;

// The state types definitions
interface State {
  [key: string]: unknown;
}

const state = (): State => ({});

export const mutations = mutationTree(state, {
  SET_CONFIG: function (state, config: Configuration) {
    state[config.key] = config.value;
  },
});

export const actions = actionTree(
  { state },
  {
    fetchAll: async function ({ commit }) {
      const res = await safeCall(this, configurationRepo.getAll(this));
      if (!res) {
        return null;
      }
      res.data.forEach((config: Configuration) => {
        commit("SET_CONFIG", config);
      });
      return res;
    },
    fetch: async function ({ commit }, key: string) {
      const res = await safeCall(this, configurationRepo.fetch(this, key));
      if (!res) {
        return null;
      }
      commit("SET_CONFIG", res.data);
      return res;
    },
    save: async function ({ commit }, config: Configuration) {
      const res = await safeCall(this, configurationRepo.save(this, config));
      if (!res) {
        return null;
      }

      commit("SET_CONFIG", res.data);
      return res;
    },
    update: async function ({ commit }, config: Configuration) {
      const res = await safeCall(this, configurationRepo.update(this, config));
      if (!res) {
        return null;
      }
      commit("SET_CONFIG", res.data);
      return res;
    },
  }
);

export const getters = getterTree(state, {
  get: (state) => (key: string) => {
    return state[key];
  },
});
