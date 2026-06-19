import { PastSharedMeal } from "../../meal-sharing/meals.model.js";
import { ONE_EURO_IN_CENTS, SHARED_MEAL } from "../transaction.js";
import { AmountTooHigh } from "./shared-meal.error.js";

export type SharedMealTransaction = {
  amount: number;
  context: string;
  to: number;
  from: number;
  type: typeof SHARED_MEAL;
};

const MAX_AMOUNT = ONE_EURO_IN_CENTS * 1000;

export class SharedMeal {
  static refund(meal: PastSharedMeal): SharedMealTransaction[] {
    if (meal.expense.amount > MAX_AMOUNT) throw new AmountTooHigh();

    const context = `Repas partagé du ${meal.meal.date}`;
    const guests = meal.shotguns.filter(({ id }) => id !== meal.chef.id);
    return guests.map(({ id, portions }) => ({
      amount: this.computeGuestAmount(
        meal.expense.amount,
        meal.portionCount,
        portions,
      ),
      context,
      to: meal.chef.id,
      type: SHARED_MEAL,
      from: id,
    }));
  }

  private static computeGuestAmount(
    totalAmount: number,
    totalPortions: number,
    guestPortions: number,
  ) {
    const guestAmount = Math.ceil(
      (totalAmount / totalPortions) * guestPortions,
    );
    return guestAmount;
  }
}
