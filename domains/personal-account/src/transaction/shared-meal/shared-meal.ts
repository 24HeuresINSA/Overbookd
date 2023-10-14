import { EndSharedMeal } from "../../meal-sharing/meals.model";
import { SHARED_MEAL } from "../transaction.model";

type SharedMealTransaction = {
  amount: number;
  context: string;
  to: number;
  from: number;
  type: typeof SHARED_MEAL;
};
export class SharedMeal {
  static refound(meal: EndSharedMeal): SharedMealTransaction[] {
    const amount = this.divideAmount(meal.amount, meal.guests.length);
    const context = `Repas partage du ${meal.date}`;
    const guests = meal.guests.filter((id) => id !== meal.chef.id);
    return guests.map((from) => ({
      amount,
      context,
      to: meal.chef.id,
      type: SHARED_MEAL,
      from,
    }));
  }

  private static INDIVIDUAL_AMOUNT_STEP = 5;

  private static divideAmount(totalAmount: number, guests: number) {
    const individualAmount = totalAmount / guests;
    const individualAmountSteps = Math.ceil(
      individualAmount / this.INDIVIDUAL_AMOUNT_STEP
    );
    return individualAmountSteps * this.INDIVIDUAL_AMOUNT_STEP;
  }
}
