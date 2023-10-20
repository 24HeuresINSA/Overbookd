import {
  IDefineMealDate,
  IExposeSharedMeal,
} from "@overbookd/personal-account";
import { actionTree, mutationTree } from "typed-vuex";
import { MealSharingRepository } from "~/repositories/meal-sharing.repository";

interface MealSharingState {
  sharedMeal?: IExposeSharedMeal;
}

export const state: MealSharingState = {
  sharedMeal: undefined,
};

export const mutations = mutationTree(state, {
  SET_SHARED_MEAL(state, sharedMeal: IExposeSharedMeal) {
    state.sharedMeal = sharedMeal;
  },
  RESET_SHARED_MEAL(state) {
    state.sharedMeal = undefined;
  },
});

export const actions = actionTree(
  { state },
  {
    async offerSharedMeal(
      { commit, rootState },
      creatMeal: { menu: string; date: IDefineMealDate },
    ) {
      const chefId = rootState.user.me.id;

      const res = await MealSharingRepository.offer(this, {
        ...creatMeal,
        chefId,
      });

      if (!res) return;
      commit("SET_SHARED_MEAL", res.data);
    },

    async find({ commit }, mealId: number) {
      const res = await MealSharingRepository.find(this, mealId);

      if (!res) return;
      commit("SET_SHARED_MEAL", res.data);
    },
  },
);
