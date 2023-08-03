import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { PublicAnimationWithFa } from "~/utils/models/fa";

export const state = () => ({
  publicAnimations: [] as PublicAnimationWithFa[],
});

export type PublicAnimationState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_PUBLIC_ANIMATIONS(state, publicAnimations: PublicAnimationWithFa[]) {
    state.publicAnimations = publicAnimations;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchAllPublicAnimations({ commit }) {
      const publishAnimations = await safeCall(
        this,
        RepoFactory.faRepo.getAllPublicAnimations(this),
        {
          errorMessage: "Probleme lors de la récuperation des animations",
        }
      );
      if (!publishAnimations) return;
      commit("SET_PUBLIC_ANIMATIONS", publishAnimations.data);
    },
  }
);
