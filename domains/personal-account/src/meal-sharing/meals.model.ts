import { ONE_EURO_IN_CENTS } from "../transaction/transaction.js";
import { Adherent, Shotgun } from "./adherent.js";

export type Expense = {
  amount: number;
};

export type AboutMeal = { menu: string; date: string };

export type OnGoingSharedMeal = {
  id: number;
  createdAt: Date;
  meal: AboutMeal;
  chef: Adherent;
  areShotgunsOpen: boolean;
  areMultipleShotgunsAllowed: boolean;
  portionCount: number;
  shotguns: Shotgun[];
};

export type PastSharedMeal = OnGoingSharedMeal & {
  expense: Expense;
  closedAt: Date;
};

export type SharedMeal = PastSharedMeal | OnGoingSharedMeal;

export function isPastMeal(meal: SharedMeal): meal is PastSharedMeal {
  return "expense" in meal;
}

export function isOnGoingMeal(meal: SharedMeal): meal is OnGoingSharedMeal {
  return !("expense" in meal);
}

export const MAX_PORTIONS_PER_GUEST = 5;
export const MAX_SHARED_MEAL_EXPENSE_AMOUNT = ONE_EURO_IN_CENTS * 1000;
