import { Expense, AboutMeal, OnGoingSharedMeal } from "./meals.model";
import { Meal } from "./meal";
import { MealDate } from "./meal-sharing";
import { Adherent, Shotgun, Shotguns } from "./adherent";
import { PastSharedMealBuilder } from "./past-shared-meal.builder";
import { AlreadyShotguned } from "./meal-sharing.error";

type InitSharedMeal = {
  id: number;
  menu: string;
  date: MealDate;
  chef: Adherent;
};

type BuildOnGoingSharedMeal = Omit<OnGoingSharedMeal, "shotgunCount">;

export class OnGoingSharedMealBuilder implements OnGoingSharedMeal {
  private constructor(
    readonly id: number,
    readonly meal: AboutMeal,
    readonly chef: Adherent,
    private readonly _shotguns: Shotguns,
  ) {}

  static init(initializer: InitSharedMeal): OnGoingSharedMealBuilder {
    const { id, menu, date, chef } = initializer;
    const meal = Meal.init(menu, date);
    const firstShotgun = { ...chef, date: new Date() };
    const shotguns = Shotguns.init().add(firstShotgun);
    return new OnGoingSharedMealBuilder(id, meal, chef, shotguns);
  }

  static build(builder: BuildOnGoingSharedMeal): OnGoingSharedMealBuilder {
    const { id, meal, chef, shotguns: shotgunList } = builder;
    const shotguns = Shotguns.build(shotgunList);
    return new OnGoingSharedMealBuilder(id, meal, chef, shotguns);
  }

  get shotguns(): Shotgun[] {
    return this._shotguns.all;
  }

  get shotgunCount(): number {
    return this._shotguns.all.length;
  }

  hasShotgun(id: Adherent["id"]): boolean {
    return this.shotguns.some((adherent) => adherent.id === id);
  }

  shotgunFor(adherent: Adherent): OnGoingSharedMealBuilder {
    if (this.hasShotgun(adherent.id)) throw new AlreadyShotguned(this);
    const shotgun = { ...adherent, date: new Date() };
    const shotguns = this._shotguns.add(shotgun);
    return new OnGoingSharedMealBuilder(
      this.id,
      this.meal,
      this.chef,
      shotguns,
    );
  }

  close(expense: Expense): PastSharedMealBuilder {
    return PastSharedMealBuilder.build({
      id: this.id,
      meal: this.meal,
      chef: this.chef,
      shotguns: this.shotguns,
      expense,
    });
  }
}
