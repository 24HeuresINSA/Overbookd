import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { SitePublishAnimationWithFa } from "~/utils/models/fa";

export const state = () => ({
  publishAnimations: [] as SitePublishAnimationWithFa[],
});

export type PublishAnimationState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_PUBLISH_ANIMATIONS(
    state,
    publishAnimations: SitePublishAnimationWithFa[]
  ) {
    state.publishAnimations = publishAnimations;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchAllPublishAnimations({ commit }) {
      const publishAnimations = await safeCall(
        this,
        RepoFactory.faRepo.getAllPublishAnimation(this),
        {
          errorMessage: "Probleme lors de la récuperation des animations",
        }
      );
      if (!publishAnimations) return;
      commit("SET_PUBLISH_ANIMATIONS", publishAnimations.data);
    },
  }
);
