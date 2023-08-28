import { actionTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import {
  Signage,
  SignageForm,
  SignageSearchOptions,
  SignageUpdateForm,
} from "@overbookd/signa";
import { RepoFactory } from "~/repositories/repo-factory";

const signageRepository = RepoFactory.CatalogSignageRepository;

interface State {
  signages: Signage[];
}

export const state = (): State => ({
  signages: [],
});

export const mutations = mutationTree(state, {
  SET_SIGNAGES(state, signages: Signage[]) {
    state.signages = signages;
  },
  ADD_SIGNAGE(state, signage: Signage) {
    state.signages.push(signage);
  },
  UPDATE_SIGNAGE(state, signage: Signage) {
    const index = state.signages.findIndex((s) => s.id === signage.id);
    if (index < 0) return;
    state.signages.splice(index, 1, signage);
  },
  DELETE_SIGNAGE(state, signage: Signage) {
    state.signages = state.signages.filter((s) => s.id !== signage.id);
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchSignages(
      { commit },
      signageSearchOptions: SignageSearchOptions,
    ): Promise<void> {
      const res = await safeCall<Signage[]>(
        this,
        signageRepository.searchSignages(this, signageSearchOptions),
      );
      if (!res) return;
      commit("SET_SIGNAGES", res.data);
    },

    async createSignage({ commit }, signageForm: SignageForm): Promise<void> {
      const res = await safeCall<Signage>(
        this,
        signageRepository.createSignage(this, signageForm),
        {
          successMessage: "La signalétique a été créé avec succès",
          errorMessage: "Erreur lors de la création de la signalétique",
        },
      );
      if (!res) return;
      commit("ADD_SIGNAGE", res.data);
    },

    async updateSignage({ commit }, form: SignageUpdateForm): Promise<void> {
      const { id, ...signageForm } = form;
      const res = await safeCall<Signage>(
        this,
        signageRepository.updateSignage(this, id, signageForm),
        {
          successMessage: "La signalétique a été mis a jour avec succès",
          errorMessage: "Erreur lors de la mise à jour de la signalétique",
        },
      );
      if (!res) return;
      commit("UPDATE_SIGNAGE", res.data);
    },

    async deleteSignage({ commit }, signage: Signage): Promise<void> {
      const res = await safeCall(
        this,
        signageRepository.deleteSignage(this, signage.id),
        {
          successMessage: `${signage.name} supprimé avec succès`,
          errorMessage: `Erreur lors de la suppression de ${signage.name}`,
        },
      );
      if (!res) return;
      commit("DELETE_SIGNAGE", signage);
    },
  },
);
