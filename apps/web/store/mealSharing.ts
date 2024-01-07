import { OfferMeal } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import {
  Expense,
  OnGoingSharedMeal,
  PastSharedMeal,
  SharedMeal,
  isOnGoingMeal,
  isPastMeal,
} from "@overbookd/personal-account";
import { actionTree, mutationTree, getterTree } from "typed-vuex";
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
  UPDATE_MEAL_INSIDE_MEALS(state, sharedMeal: SharedMeal) {
    const mealIndex = state.meals.findIndex(({ id }) => id === sharedMeal.id);
    if (mealIndex === -1) return;

    state.meals = updateItemToList(state.meals, mealIndex, sharedMeal);
  },
});

export const getters = getterTree(state, {
  onGoingMeals(state): OnGoingSharedMeal[] {
    return state.meals.filter(isOnGoingMeal);
  },
  pastMeals(state): PastSharedMeal[] {
    return state.meals.filter(isPastMeal);
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
      commit("UPDATE_MEAL_INSIDE_MEALS", res.data);
    },

    async recordExpense(
      { commit },
      { mealId, expense }: { mealId: SharedMeal["id"]; expense: Expense },
    ) {
      const res = await safeCall(
        this,
        MealSharingRepository.recordExpense(this, mealId, expense),
      );

      if (!res) return;
      commit("UPDATE_MEAL_INSIDE_MEALS", res.data);
    },
  },
);
