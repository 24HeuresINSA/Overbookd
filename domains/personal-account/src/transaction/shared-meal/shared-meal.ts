import { PastSharedMeal } from "../../meal-sharing/meals.model";
import { ONE_EURO_IN_CENTS, SHARED_MEAL } from "../transaction.model";
import { AmountTooHigh } from "./shared-meal.error";

export type SharedMealTransaction = {
  amount: number;
  context: string;
  to: number;
  from: number;
  type: typeof SHARED_MEAL;
};

const MAX_AMOUNT = ONE_EURO_IN_CENTS * 1000;

export class SharedMeal {
  static refound(meal: PastSharedMeal): SharedMealTransaction[] {
    if (meal.expense.amount > MAX_AMOUNT) throw new AmountTooHigh();

    const amount = this.divideAmount(meal.expense.amount, meal.shotgunCount);
    const context = `Repas partage du ${meal.meal.date}`;
    const guests = meal.shotguns.filter(({ id }) => id !== meal.chef.id);
    return guests.map(({ id }) => ({
      amount,
      context,
      to: meal.chef.id,
      type: SHARED_MEAL,
      from: id,
    }));
  }

  private static INDIVIDUAL_AMOUNT_STEP = 5;

  private static divideAmount(totalAmount: number, guests: number) {
    const individualAmount = totalAmount / guests;
    const individualAmountSteps = Math.ceil(
      individualAmount / this.INDIVIDUAL_AMOUNT_STEP,
    );
    return individualAmountSteps * this.INDIVIDUAL_AMOUNT_STEP;
  }
}
