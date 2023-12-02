import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { PublicAnimationWithFa } from "~/utils/models/fa.model";
import { HttpStringified } from "@overbookd/http";

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
      const res = await safeCall(
        this,
        RepoFactory.FaRepository.getAllPublicAnimations(this),
        {
          errorMessage: "Probleme lors de la récuperation des animations",
        },
      );
      if (!res) return;
      commit("SET_PUBLIC_ANIMATIONS", castFaPublicAnimationsWithDate(res.data));
    },
  },
);

function castFaPublicAnimationsWithDate(
  publicAnimations: HttpStringified<PublicAnimationWithFa[]>,
): PublicAnimationWithFa[] {
  return publicAnimations.map(castFaPublicAnimationWithDate);
}

function castFaPublicAnimationWithDate(
  publicAnimation: HttpStringified<PublicAnimationWithFa>,
): PublicAnimationWithFa {
  return {
    ...publicAnimation,
    fa: {
      ...publicAnimation.fa,
      timeWindows: publicAnimation.fa.timeWindows.map((tw) => ({
        ...tw,
        start: new Date(tw.start),
        end: new Date(tw.end),
      })),
    },
  };
}
