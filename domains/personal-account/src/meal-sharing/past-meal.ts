import { EndSharedMeal, IExposeSharedMeal } from "./meals.model";
import { Adherent, Shotgun } from "./adherent";
import { IExposePastMeal } from "./meals.model";
import { IInformAboutMeal } from "./meals.model";
import { Expense } from "./meals.model";
import { MealSharingError } from "./meal-sharing.error";

export const PAST_MEAL_ERROR =
  "Ce repas partage a ete cloture, il n'est plus possible de shotgun";

class PastMealError extends MealSharingError {
  constructor() {
    super(PAST_MEAL_ERROR);
  }
}

type IInitPastMeal = {
  id: number;
  meal: IInformAboutMeal;
  chef: Adherent;
  expense: Expense;
  shotguns: Shotgun[];
};

export class PastMeal implements IExposePastMeal {
  private constructor(
    readonly id: number,
    readonly meal: IInformAboutMeal,
    readonly chef: Adherent,
    private readonly _shotguns: Shotgun[],
    private readonly expense: Expense,
  ) {}

  static init({ id, meal, chef, shotguns, expense }: IInitPastMeal): PastMeal {
    return new PastMeal(id, meal, chef, shotguns, expense);
  }

  shotgunFor(): IExposeSharedMeal {
    throw new PastMealError();
  }

  get inTimeShotguns(): number {
    return this._shotguns.filter(
      ({ date }) => date.getTime() < this.expense.date.getTime(),
    ).length;
  }

  get shotguns(): number {
    return this._shotguns.length;
  }

  get amount(): number {
    return this.expense.amount;
  }

  get event(): EndSharedMeal {
    return {
      chef: this.chef,
      date: this.meal.date,
      amount: this.amount,
      guests: this._shotguns.map(({ id }) => id),
    };
  }
}
