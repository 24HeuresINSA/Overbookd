import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { Configuration } from "@overbookd/configuration";
import { updateItemToList } from "@overbookd/list";
import { safeCall } from "~/utils/api/calls";
import { defaultCommitmentPresentation } from "@overbookd/registration";
import { ConfigurationRepository } from "~/repositories/configuration.repository";

export const state = () => ({
  configurations: [] as Configuration[],
});

export const getters = getterTree(state, {
  get: (state) => (key: string) => {
    return state.configurations.find((c) => c.key === key)?.value;
  },
  eventStartDate(_, getters): Date {
    const eventStartString = getters.get("eventDate")?.start;
    if (!eventStartString) return new Date();
    return new Date(eventStartString);
  },
  registerFormDescription(_, getters): string {
    return (
      getters.get("registerForm")?.description ?? defaultCommitmentPresentation
    );
  },
});

export const mutations = mutationTree(state, {
  SET_ALL_CONFIG(state, configurations: Configuration[]) {
    state.configurations = configurations;
  },

  SET_CONFIG(state, configuration: Configuration) {
    const index = state.configurations.findIndex(
      (c) => c.key === configuration.key,
    );
    const configurations =
      index !== -1
        ? updateItemToList(state.configurations, index, configuration)
        : [...state.configurations, configuration];
    state.configurations = configurations;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchAll({ commit }) {
      const res = await safeCall(this, ConfigurationRepository.getAll(this));
      if (!res) return;
      commit("SET_ALL_CONFIG", res.data);
    },

    async fetch({ commit }, key: string) {
      const res = await safeCall(
        this,
        ConfigurationRepository.fetch(this, key),
      );
      if (!res) return;
      commit("SET_CONFIG", res.data);
    },

    async save({ commit }, config: Configuration) {
      const res = await safeCall(
        this,
        ConfigurationRepository.save(this, config),
        {
          successMessage: "La configuration a été sauvegardée avec succès ✅",
          errorMessage: "Erreur lors de la sauvegarde de la configuration ❌",
        },
      );
      if (!res) return;
      commit("SET_CONFIG", res.data);
    },
  },
);
