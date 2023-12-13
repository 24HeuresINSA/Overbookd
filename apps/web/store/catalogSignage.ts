import { actionTree, mutationTree } from "typed-vuex";
import { Signage, SignageForm, SignageUpdateForm } from "@overbookd/signa";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { CatalogSignageRepository } from "~/repositories/catalog-signage.repository";
import { updateItemToList } from "@overbookd/list";
import { SignageWithPotentialImage } from "~/utils/models/catalog-signa.model";

const signageRepository = RepoFactory.CatalogSignageRepository;

interface State {
  signages: SignageWithPotentialImage[];
}

export const state = (): State => ({
  signages: [],
});

export const mutations = mutationTree(state, {
  SET_SIGNAGES(state, signages: SignageWithPotentialImage[]) {
    state.signages = signages;
  },
  ADD_SIGNAGE(state, signage: SignageWithPotentialImage) {
    state.signages.push(signage);
  },
  UPDATE_SIGNAGE(state, signage: SignageWithPotentialImage) {
    const index = state.signages.findIndex((s) => s.id === signage.id);
    if (index < 0) return;
    state.signages = updateItemToList(state.signages, index, signage);
  },
  DELETE_SIGNAGE(state, signage: SignageWithPotentialImage) {
    state.signages = state.signages.filter((s) => s.id !== signage.id);
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchSignages({ commit }): Promise<void> {
      const res = await safeCall<Signage[]>(
        this,
        signageRepository.fetchSignages(this),
      );
      if (!res) return;
      commit("SET_SIGNAGES", res.data);
    },

    async fetchSignagesImages({ state, commit }): Promise<void> {
      const signages = await Promise.all(
        state.signages.map(async (signage) => {
          const signageImage = await CatalogSignageRepository.getSignageImage(
            this,
            signage.id,
          );
          if (!signageImage) return signage;
          return {
            ...signage,
            imageBlob: signageImage,
          };
        }),
      );
      commit("SET_SIGNAGES", signages);
    },

    async createSignage({ commit }, signageForm: SignageForm): Promise<Signage | void> {
      const res = await safeCall<Signage>(
        this,
        signageRepository.createSignage(this, signageForm),
        {
          successMessage: "La signalétique a été créé avec succès ✅",
          errorMessage: "Erreur lors de la création de la signalétique ❌",
        },
      );
      if (!res) return;
      commit("ADD_SIGNAGE", res.data);
            return res.data;

    },

    async updateSignage({ commit }, form: SignageUpdateForm): Promise<void> {
      const { id, ...signageForm } = form;
      const res = await safeCall<Signage>(
        this,
        signageRepository.updateSignage(this, id, signageForm),
        {
          successMessage: "La signalétique a été mis a jour avec succès ✅",
          errorMessage: "Erreur lors de la mise à jour de la signalétique ❌",
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
          successMessage: `${signage.name} supprimé avec succès ✅`,
          errorMessage: `Erreur lors de la suppression de ${signage.name} ❌`,
        },
      );
      if (!res) return;
      commit("DELETE_SIGNAGE", signage);
    },
    async uploadSignageImage(
      { commit },
      {
        signageId,
        signageImage,
      }: { signageId: number; signageImage: FormData },
    ): Promise<void> {
      const res = await safeCall(
        this,
        signageRepository.uploadSignageImage(this, signageId, signageImage),
        {
          successMessage: `Image de la signalétique mise à jour avec succès ✅`,
          errorMessage: `Erreur lors de la mise à jour de l'image de la signalétique ❌`,
        },
      );
      if (!res) return;
      const imageBlob = await signageRepository.getSignageImage(
        this,
        signageId,
      );
      const signage = { ...res.data, imageBlob };
      commit("UPDATE_SIGNAGE", signage);
    },
  },
);
