import type { Adherent, Shotgun } from "./adherent.js";
import { Shotguns } from "./adherent.js";
import type { PastSharedMeal, AboutMeal, Expense } from "./meals.model.js";
import { MealSharingError } from "./meal-sharing.error.js";

export const SHOTGUN_PAST_MEAL_ERROR =
  "❌ Ce repas partagé a été cloturé, il n'est plus possible de le shotgun";

export const CANCEL_SHOTGUN_PAST_MEAL_ERROR =
  "❌ Ce repas partagé a été cloturé, il n'est plus possible d'annuler un shotgun";

class PastMealError extends MealSharingError {
  private constructor(message: string) {
    super(message);
  }

  static get shotgun(): PastMealError {
    return new PastMealError(SHOTGUN_PAST_MEAL_ERROR);
  }

  static get cancelShotgun(): PastMealError {
    return new PastMealError(CANCEL_SHOTGUN_PAST_MEAL_ERROR);
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
    throw PastMealError.shotgun;
  }

  cancelShotgunFor(): PastSharedMealBuilder {
    throw PastMealError.cancelShotgun;
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
