import { OfferMeal } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import { SharedMeal } from "@overbookd/personal-account";
import { actionTree, mutationTree } from "typed-vuex";
import { MealSharingRepository } from "~/repositories/meal-sharing.repository";
import { safeCall } from "~/utils/api/calls";

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
  ADD_GUEST(state, sharedMeal: SharedMeal) {
    const mealIndex = state.meals.findIndex(({ id }) => id === sharedMeal.id);
    if (mealIndex === -1) return;

    state.meals = updateItemToList(state.meals, mealIndex, sharedMeal);
  },
});

export const actions = actionTree(
  { state },
  {
    async offerSharedMeal({ commit, dispatch }, offerMeal: OfferMeal) {
      const res = await safeCall(
        this,
        MealSharingRepository.offer(this, offerMeal),
      );

      if (!res) return;
      commit("SET_SHARED_MEAL", res.data);
      dispatch("fetchAll");
    },

    async find({ commit }, mealId: number) {
      const res = await safeCall(
        this,
        MealSharingRepository.find(this, mealId),
      );

      if (!res) return;
      commit("SET_SHARED_MEAL", res.data);
    },

    async fetchAll({ commit }) {
      const res = await safeCall(this, MealSharingRepository.all(this));

      if (!res) return;
      commit("LIST_MEALS", res.data);
    },

    async shotgun({ commit }, mealId: SharedMeal["id"]) {
      const res = await safeCall(
        this,
        MealSharingRepository.shotgun(this, mealId),
      );

      if (!res) return;
      commit("ADD_GUEST", res.data);
    },
  },
);
