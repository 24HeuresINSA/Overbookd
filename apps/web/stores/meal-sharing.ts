import type { HttpStringified, OfferMeal } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import {
  type Expense,
  type OnGoingSharedMeal,
  type PastSharedMeal,
  type SharedMeal,
  isOnGoingMeal,
  isPastMeal,
} from "@overbookd/personal-account";
import { MealSharingRepository } from "~/repositories/meal-sharing.repository";
import { isSuccess } from "~/utils/http/api-fetch";

type State = {
  sharedMeal?: SharedMeal;
  meals: SharedMeal[];
};

export const useMealSharingStore = defineStore("meal-sharing", {
  state: (): State => ({
    sharedMeal: undefined,
    meals: [],
  }),
  getters: {
    onGoingMeals(state): OnGoingSharedMeal[] {
      return state.meals.filter(isOnGoingMeal);
    },
    pastMeals(state): PastSharedMeal[] {
      return state.meals.filter(isPastMeal);
    },
  },
  actions: {
    async offerSharedMeal(offerMeal: OfferMeal) {
      const res = await MealSharingRepository.offer(offerMeal);
      if (!isSuccess(res)) return;
      this.sharedMeal = castSharedMealWithDate(res);
      await this.fetchAll();
    },

    async find(mealId: number) {
      const res = await MealSharingRepository.find(mealId);
      if (!isSuccess(res)) return;
      this.sharedMeal = castSharedMealWithDate(res);
    },

    async fetchAll() {
      const res = await MealSharingRepository.all();
      if (!isSuccess(res)) return;
      this.meals = res.map(castSharedMealWithDate);
    },

    async shotgun(mealId: SharedMeal["id"]) {
      const res = await MealSharingRepository.shotgun(mealId);
      if (!isSuccess(res)) return;
      const sharedMeal = castSharedMealWithDate(res);
      this._updateMealInsideMeals(sharedMeal);
    },

    async recordExpense(mealId: SharedMeal["id"], expense: Expense) {
      const res = await MealSharingRepository.recordExpense(mealId, expense);
      if (!isSuccess(res)) return;
      const sharedMeal = castSharedMealWithDate(res);
      this._updateMealInsideMeals(sharedMeal);
    },

    _updateMealInsideMeals(sharedMeal: SharedMeal) {
      const mealIndex = this.meals.findIndex(({ id }) => id === sharedMeal.id);
      if (mealIndex === -1) return;
      this.meals = updateItemToList(this.meals, mealIndex, sharedMeal);
    },
  },
});

function castSharedMealWithDate(
  sharedMeal: HttpStringified<SharedMeal>,
): SharedMeal {
  return {
    ...sharedMeal,
    shotguns: sharedMeal.shotguns.map((shotgun) => ({
      ...shotgun,
      date: new Date(shotgun.date),
    })),
  };
}
