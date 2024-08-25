import { Expense, OnGoingSharedMeal } from "./meals.model.js";
import { Meal } from "./meal.js";
import { MealDate, SharedMealBuilder } from "./meal-sharing.js";
import { Adherent, Shotguns } from "./adherent.js";
import { PastSharedMealBuilder } from "./past-shared-meal.builder.js";
import { AlreadyShotguned } from "./meal-sharing.error.js";

type InitSharedMeal = {
  id: number;
  menu: string;
  date: MealDate;
  chef: Adherent;
};

type BuildOnGoingSharedMeal = Omit<OnGoingSharedMeal, "shotgunCount">;

export class OnGoingSharedMealBuilder
  extends SharedMealBuilder
  implements OnGoingSharedMeal
{
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

  cancelShotgunFor(guest: Adherent["id"]): OnGoingSharedMealBuilder {
    const shotguns = this._shotguns.remove(guest);
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

  isChef(adherent: Adherent["id"]) {
    return adherent === this.chef.id;
  }
}
