import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { Configuration } from "~/utils/models/configuration";

const configurationRepo = RepoFactory.ConfigurationRepository;

type State = Map<string, any>;

const state = (): State => new Map<string, any>();

export const mutations = mutationTree(state, {
  SET_ALL_CONFIG(state, configurations: Configuration[]) {
    configurations.map((configuration) => {
      state.set(configuration.key, configuration.value);
    });
  },
  SET_CONFIG(state, configuration: Configuration) {
    state.set(configuration.key, configuration.value);
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

export const getters = getterTree(state, {
  get: (state: State) => (key: string) => {
    for (const [k, value] of Object.entries(state)) {
      if (k === key) return value;
    }
    return undefined;
  },
});
