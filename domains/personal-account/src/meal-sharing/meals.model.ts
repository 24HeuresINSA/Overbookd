import { Adherent, Shotgun } from "./adherent.js";

export type Expense = {
  amount: number;
  date: Date;
};

export type AboutMeal = { menu: string; date: string };

export type OnGoingSharedMeal = {
  id: number;
  meal: AboutMeal;
  chef: Adherent;
  areShotgunsOpen: boolean;
  portionCount: number;
  shotguns: Shotgun[];
};

export type PastSharedMeal = OnGoingSharedMeal & {
  expense: Expense;
};

export type SharedMeal = PastSharedMeal | OnGoingSharedMeal;

export function isPastMeal(meal: SharedMeal): meal is PastSharedMeal {
  return "expense" in meal;
}

export function isOnGoingMeal(meal: SharedMeal): meal is OnGoingSharedMeal {
  return !("expense" in meal);
}
