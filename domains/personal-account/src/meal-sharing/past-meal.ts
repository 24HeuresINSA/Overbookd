import { IExposeSharedMeal } from "./meals.model";
import { Adherent } from "./adherent";
import { IExposePastMeal } from "./meals.model";
import { IInformAboutMeal } from "./meals.model";
import { Expense } from "./meal-sharing";
import { MealSharingError } from "./meal-sharing.error";

export const PAST_MEAL_ERROR =
  "Ce repas partage a ete cloture, il n'est plus possible de shotgun";

class PastMealError extends MealSharingError {
  constructor() {
    super(PAST_MEAL_ERROR);
  }
}

export class PastMeal implements IExposePastMeal {
  private constructor(
    readonly id: number,
    readonly meal: IInformAboutMeal,
    readonly chef: Adherent,
    private readonly _shotguns: { inTime: number; total: number },
    readonly amount: number,
  ) {}

  static init(
    sharedMeal: IExposeSharedMeal,
    { amount, date }: Expense,
  ): PastMeal {
    const inTimeShotguns = sharedMeal.shotgunsBefore(date);
    const { id, meal, chef, shotguns: totalShotguns } = sharedMeal;
    const shotguns = {
      inTime: inTimeShotguns,
      total: totalShotguns,
    };
    return new PastMeal(id, meal, chef, shotguns, amount);
  }

  shotgunFor(): IExposeSharedMeal {
    throw new PastMealError();
  }

  get inTimeShotguns(): number {
    return this._shotguns.inTime;
  }

  get shotguns(): number {
    return this._shotguns.total;
  }
}
