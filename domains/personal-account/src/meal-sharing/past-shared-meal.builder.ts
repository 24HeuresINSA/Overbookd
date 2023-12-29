import type { Adherent, Shotgun } from "./adherent";
import { Shotguns } from "./adherent";
import type { PastSharedMeal, AboutMeal, Expense } from "./meals.model";
import { MealSharingError } from "./meal-sharing.error";

export const PAST_MEAL_ERROR =
  "❌ Ce repas partagé a été cloturé, il n'est plus possible de le shotgun";

class PastMealError extends MealSharingError {
  constructor() {
    super(PAST_MEAL_ERROR);
  }
}

type BuildPastSharedMeal = {
  id: number;
  meal: AboutMeal;
  chef: Adherent;
  expense: Expense;
  shotguns: Shotgun[];
};

export class PastSharedMealBuilder implements PastSharedMeal {
  private constructor(
    readonly id: number,
    readonly meal: AboutMeal,
    readonly chef: Adherent,
    private readonly _shotguns: Shotguns,
    readonly expense: Expense,
  ) {}

  static build(builder: BuildPastSharedMeal): PastSharedMealBuilder {
    const { id, meal, chef, shotguns: shotgunList, expense } = builder;
    const shotguns = Shotguns.build(shotgunList);
    return new PastSharedMealBuilder(id, meal, chef, shotguns, expense);
  }

  shotgunFor(): PastSharedMealBuilder {
    throw new PastMealError();
  }

  get shotguns(): Shotgun[] {
    return this._shotguns.all;
  }

  get inTimeShotguns(): number {
    return this._shotguns.before(this.expense.date).length;
  }

  get shotgunCount(): number {
    return this._shotguns.all.length;
  }
}
