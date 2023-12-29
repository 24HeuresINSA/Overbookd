import { PastSharedMeal } from "../../meal-sharing/meals.model";
import { SHARED_MEAL } from "../transaction.model";

type SharedMealTransaction = {
  amount: number;
  context: string;
  to: number;
  from: number;
  type: typeof SHARED_MEAL;
};
export class SharedMeal {
  static refound(meal: PastSharedMeal): SharedMealTransaction[] {
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
