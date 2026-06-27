import type { HttpStringified, OfferMeal } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import {
  type Adherent,
  type Expense,
  type OnGoingSharedMeal,
  type PastSharedMeal,
  type SharedMeal,
} from "@overbookd/personal-account";
import { MealSharingRepository } from "~/repositories/meal-sharing.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

type State = {
  meals: SharedMeal[];
  onGoingMeals: OnGoingSharedMeal[];
  pastMeals: PastSharedMeal[];
};

export const useMealSharingStore = defineStore("meal-sharing", {
  state: (): State => ({
    meals: [],
    onGoingMeals: [],
    pastMeals: [],
  }),
  actions: {
    async offerSharedMeal(offerMeal: OfferMeal) {
      const res = await MealSharingRepository.offer(offerMeal);
      if (isHttpError(res)) return;
      const sharedMeal = castSharedMealWithDate(res);
      this.onGoingMeals = [sharedMeal, ...this.onGoingMeals];
    },

    async fetchAll() {
      const res = await MealSharingRepository.all();
      if (isHttpError(res)) return;
      this.meals = res.map(castSharedMealWithDate);
    },

    async fetchOnGoing() {
      const res = await MealSharingRepository.allOnGoing();
      if (isHttpError(res)) return;
      this.onGoingMeals = res.map(castOnGoingSharedMealWithDate);
    },

    async fetchAllPast() {
      const res = await MealSharingRepository.allPast();
      if (isHttpError(res)) return;
      this.pastMeals = res.map(castPastSharedMealWithDate);
    },

    async fetchMyPast() {
      const res = await MealSharingRepository.myPast();
      if (isHttpError(res)) return;
      this.pastMeals = res.map(castPastSharedMealWithDate);
    },

    async shotgun(mealId: SharedMeal["id"]) {
      const res = await MealSharingRepository.shotgun(mealId);
      if (isHttpError(res)) return;
      const sharedMeal = castSharedMealWithDate(res);
      this._updateMealInsideOnGoingMeals(sharedMeal);
    },

    async removePortion(mealId: SharedMeal["id"], guestId: Adherent["id"]) {
      const res = await MealSharingRepository.removePortion(mealId, guestId);
      if (isHttpError(res)) return;
      const sharedMeal = castSharedMealWithDate(res);
      this._updateMealInsideOnGoingMeals(sharedMeal);
    },

    async cancelShotgun(mealId: SharedMeal["id"], guestId: Adherent["id"]) {
      const res = await MealSharingRepository.cancelShotgun(mealId, guestId);
      if (isHttpError(res)) return;
      const sharedMeal = castSharedMealWithDate(res);
      this._updateMealInsideOnGoingMeals(sharedMeal);
    },

    async recordExpense(mealId: SharedMeal["id"], expense: Expense) {
      const res = await MealSharingRepository.recordExpense(mealId, expense);
      if (isHttpError(res)) return;
      const sharedMeal = castPastSharedMealWithDate(res);
      this.onGoingMeals = this.onGoingMeals.filter(
        (meal) => meal.id !== mealId,
      );
      this.pastMeals = [sharedMeal, ...this.pastMeals];
    },

    async cancelMeal(mealId: SharedMeal["id"]) {
      const res = await MealSharingRepository.cancelMeal(mealId);
      if (isHttpError(res)) return;
      this.onGoingMeals = this.onGoingMeals.filter(
        (meal) => meal.id !== mealId,
      );
      sendInfoNotification("Le repas a été annulé");
    },

    async closeShotguns(mealId: SharedMeal["id"]) {
      const res = await MealSharingRepository.closeShotguns(mealId);
      if (isHttpError(res)) return;
      const sharedMeal = castSharedMealWithDate(res);
      this._updateMealInsideOnGoingMeals(sharedMeal);
    },

    async openShotguns(mealId: SharedMeal["id"]) {
      const res = await MealSharingRepository.openShotguns(mealId);
      if (isHttpError(res)) return;
      const sharedMeal = castSharedMealWithDate(res);
      this._updateMealInsideOnGoingMeals(sharedMeal);
    },

    async allowMultipleShotguns(mealId: SharedMeal["id"]) {
      const res = await MealSharingRepository.allowMultipleShotguns(mealId);
      if (isHttpError(res)) return;
      const sharedMeal = castSharedMealWithDate(res);
      this._updateMealInsideOnGoingMeals(sharedMeal);
    },

    async disallowMultipleShotguns(mealId: SharedMeal["id"]) {
      const res = await MealSharingRepository.disallowMultipleShotguns(mealId);
      if (isHttpError(res)) return;
      const sharedMeal = castSharedMealWithDate(res);
      this._updateMealInsideOnGoingMeals(sharedMeal);
    },

    _updateMealInsideOnGoingMeals(sharedMeal: SharedMeal) {
      const mealIndex = this.onGoingMeals.findIndex(
        ({ id }) => id === sharedMeal.id,
      );
      if (mealIndex === -1) return;
      this.onGoingMeals = updateItemToList(
        this.onGoingMeals,
        mealIndex,
        sharedMeal,
      );
    },
  },
});

function castOnGoingSharedMealWithDate(
  sharedMeal: HttpStringified<OnGoingSharedMeal>,
): OnGoingSharedMeal {
  return {
    ...sharedMeal,
    createdAt: new Date(sharedMeal.createdAt),
    shotguns: sharedMeal.shotguns.map((shotgun) => ({
      ...shotgun,
      date: new Date(shotgun.date),
    })),
  };
}

function castPastSharedMealWithDate(
  sharedMeal: HttpStringified<PastSharedMeal>,
): PastSharedMeal {
  return {
    ...castOnGoingSharedMealWithDate(sharedMeal),
    expense: sharedMeal.expense,
    closedAt: new Date(sharedMeal.closedAt),
  };
}

function castSharedMealWithDate(
  sharedMeal: HttpStringified<SharedMeal>,
): SharedMeal {
  const isPastMeal = "expense" in sharedMeal;
  return isPastMeal
    ? castPastSharedMealWithDate(sharedMeal)
    : castOnGoingSharedMealWithDate(sharedMeal);
}
