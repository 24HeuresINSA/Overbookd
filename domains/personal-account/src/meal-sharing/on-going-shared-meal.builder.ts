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
    return new OnGoingSharedMealBuilder(id, meal, chef, true, shotguns);
  }

  static build(builder: BuildOnGoingSharedMeal): OnGoingSharedMealBuilder {
    const { id, meal, chef, areShotgunsOpen, shotguns: shotgunList } = builder;
    const shotguns = Shotguns.build(shotgunList);
    return new OnGoingSharedMealBuilder(
      id,
      meal,
      chef,
      areShotgunsOpen,
      shotguns,
    );
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
      this.areShotgunsOpen,
      shotguns,
    );
  }

  cancelShotgunFor(guest: Adherent["id"]): OnGoingSharedMealBuilder {
    const shotguns = this._shotguns.remove(guest);
    return new OnGoingSharedMealBuilder(
      this.id,
      this.meal,
      this.chef,
      this.areShotgunsOpen,
      shotguns,
    );
  }

  close(expense: Expense): PastSharedMealBuilder {
    return PastSharedMealBuilder.build({
      id: this.id,
      meal: this.meal,
      chef: this.chef,
      areShotgunsOpen: false,
      shotguns: this.shotguns,
      expense,
    });
  }

  closeShotguns(): OnGoingSharedMealBuilder {
    return OnGoingSharedMealBuilder.build({
      id: this.id,
      meal: this.meal,
      chef: this.chef,
      areShotgunsOpen: false,
      shotguns: this.shotguns,
    });
  }

  openShotguns(): OnGoingSharedMealBuilder {
    return OnGoingSharedMealBuilder.build({
      id: this.id,
      meal: this.meal,
      chef: this.chef,
      areShotgunsOpen: true,
      shotguns: this.shotguns,
    });
  }

  isChef(adherent: Adherent["id"]): boolean {
    return adherent === this.chef.id;
  }
}
