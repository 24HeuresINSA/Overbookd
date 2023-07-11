import { actionTree, getterTree, mutationTree } from "typed-vuex";
import Vue from "vue";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { Configuration } from "~/utils/models/configuration";

const configurationRepo = RepoFactory.ConfigurationRepository;

// The state types definitions
type State = {
  [key: string]: any;
};

const state = (): State => Object.create(null);

export const mutations = mutationTree(state, {
  SET_CONFIG(state, config: Configuration) {
    Vue.set(state, config.key, config.value);
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
      res.data.forEach((config) => {
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
      const res = await safeCall(this, configurationRepo.save(this, config), {
        successMessage: "La configuration a été sauvegardée avec succès.",
        errorMessage: "Erreur lors de la sauvegarde de la configuration.",
      });
      if (!res) return null;

      commit("SET_CONFIG", res.data);
    },
  }
);

export const getters = getterTree(state, {
  get: (state: State) => (key: string) => {
    for (const [k, value] of Object.entries(state)) {
      if (k === key) {
        return value;
      }
    }
    return undefined;
  },
});
