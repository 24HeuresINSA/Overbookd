import { OfferMeal } from "@overbookd/http";
import { SharedMeal } from "@overbookd/personal-account";
import { actionTree, mutationTree } from "typed-vuex";
import { MealSharingRepository } from "~/repositories/meal-sharing.repository";

interface MealSharingState {
  sharedMeal?: SharedMeal;
  meals: SharedMeal[];
}

export const state = (): MealSharingState => ({
  sharedMeal: undefined,
  meals: [],
});

export const mutations = mutationTree(state, {
  SET_SHARED_MEAL(state, sharedMeal: SharedMeal) {
    state.sharedMeal = sharedMeal;
  },
  LIST_MEALS(state, meals: SharedMeal[]) {
    state.meals = meals;
  },
  RESET_SHARED_MEAL(state) {
    state.sharedMeal = undefined;
  },
});

export const actions = actionTree(
  { state },
  {
    async offerSharedMeal({ commit, dispatch }, offerMeal: OfferMeal) {
      const res = await MealSharingRepository.offer(this, offerMeal);

      if (!res) return;
      commit("SET_SHARED_MEAL", res.data);
      dispatch("fetchAll");
    },

    async find({ commit }, mealId: number) {
      const res = await MealSharingRepository.find(this, mealId);

      if (!res) return;
      commit("SET_SHARED_MEAL", res.data);
    },

    async fetchAll({ commit }) {
      const res = await MealSharingRepository.all(this);

      if (!res) return;
      commit("LIST_MEALS", res.data);
    },
  },
);
