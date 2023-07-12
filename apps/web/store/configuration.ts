import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { Configuration } from "~/utils/models/configuration";

const configurationRepo = RepoFactory.ConfigurationRepository;

const state = () => ({
  configurations: [] as Configuration[],
});

export const getters = getterTree(state, {
  get: (state) => (key: string) => {
    return state.configurations.find((c) => c.key === key)?.value;
  },
});

export const mutations = mutationTree(state, {
  SET_ALL_CONFIG(state, configurations: Configuration[]) {
    state.configurations = configurations;
  },

  SET_CONFIG(state, configuration: Configuration) {
    const index = state.configurations.findIndex(
      (c) => c.key === configuration.key
    );
    if (index !== -1) state.configurations[index] = configuration;
    else state.configurations.push(configuration);
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchAll({ commit }) {
      const res = await safeCall(this, configurationRepo.getAll(this));
      if (!res) return;
      commit("SET_ALL_CONFIG", res.data);
    },

    async fetch({ commit }, key: string) {
      const res = await safeCall(this, configurationRepo.fetch(this, key));
      if (!res) return;
      commit("SET_CONFIG", res.data);
    },

    async save({ commit }, config: Configuration) {
      const res = await safeCall(this, configurationRepo.save(this, config), {
        successMessage: "La configuration a été sauvegardée avec succès.",
        errorMessage: "Erreur lors de la sauvegarde de la configuration.",
      });
      if (!res) return;
      commit("SET_CONFIG", res.data);
    },
  }
);
