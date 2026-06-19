import {
  Expense,
  MAX_PORTIONS_PER_GUEST,
  OnGoingSharedMeal,
} from "./meals.model.js";
import { Meal } from "./meal.js";
import { MealDate, SharedMealBuilder } from "./meal-sharing.js";
import { Adherent, Shotguns } from "./adherent.js";
import { PastSharedMealBuilder } from "./past-shared-meal.builder.js";
import {
  MultipleShotgunsAlreadyAllowed,
  MultipleShotgunsAlreadyDisallowed,
  MultipleShotgunsDisallowed,
  ShotgunsAlreadyClosed,
  ShotgunsAlreadyOpened,
  ShotgunsClosed,
  TooManyPortions,
} from "./meal-sharing.error.js";

type InitSharedMeal = {
  id: number;
  menu: string;
  date: MealDate;
  chef: Adherent;
  areMultipleShotgunsAllowed: boolean;
};

type BuildOnGoingSharedMeal = Omit<OnGoingSharedMeal, "portionCount">;

export class OnGoingSharedMealBuilder
  extends SharedMealBuilder
  implements OnGoingSharedMeal
{
  static init(initializer: InitSharedMeal): OnGoingSharedMealBuilder {
    const { id, menu, date, chef, areMultipleShotgunsAllowed } = initializer;
    const meal = Meal.init(menu, date);
    const shotguns = Shotguns.init().addPortionFor(chef);
    return new OnGoingSharedMealBuilder(
      id,
      meal,
      chef,
      true,
      areMultipleShotgunsAllowed,
      shotguns,
    );
  }

  static build(builder: BuildOnGoingSharedMeal): OnGoingSharedMealBuilder {
    const {
      id,
      meal,
      chef,
      areShotgunsOpen,
      areMultipleShotgunsAllowed,
      shotguns: shotgunList,
    } = builder;
    const shotguns = Shotguns.build(shotgunList);
    return new OnGoingSharedMealBuilder(
      id,
      meal,
      chef,
      areShotgunsOpen,
      areMultipleShotgunsAllowed,
      shotguns,
    );
  }

  getShotgunCount(id: Adherent["id"]): number {
    return this.shotguns.find((adherent) => adherent.id === id)?.portions ?? 0;
  }

  addPortionFor(adherent: Adherent): OnGoingSharedMealBuilder {
    if (!this.areShotgunsOpen) throw new ShotgunsClosed();
    const shotgunCount = this.getShotgunCount(adherent.id);
    if (shotgunCount && !this.areMultipleShotgunsAllowed)
      throw new MultipleShotgunsDisallowed();
    if (shotgunCount >= MAX_PORTIONS_PER_GUEST) throw new TooManyPortions();

    const shotguns = this._shotguns.addPortionFor(adherent);
    return new OnGoingSharedMealBuilder(
      this.id,
      this.meal,
      this.chef,
      this.areShotgunsOpen,
      this.areMultipleShotgunsAllowed,
      shotguns,
    );
  }

  removePortionFor(guest: Adherent["id"]): OnGoingSharedMealBuilder {
    const shotguns = this._shotguns.removePortionFor(guest);
    return new OnGoingSharedMealBuilder(
      this.id,
      this.meal,
      this.chef,
      this.areShotgunsOpen,
      this.areMultipleShotgunsAllowed,
      shotguns,
    );
  }

  cancelShotgunFor(guest: Adherent["id"]): OnGoingSharedMealBuilder {
    const shotguns = this._shotguns.cancelShotgunFor(guest);
    return new OnGoingSharedMealBuilder(
      this.id,
      this.meal,
      this.chef,
      this.areShotgunsOpen,
      this.areMultipleShotgunsAllowed,
      shotguns,
    );
  }

  close(expense: Expense): PastSharedMealBuilder {
    return PastSharedMealBuilder.build({
      id: this.id,
      meal: this.meal,
      chef: this.chef,
      areShotgunsOpen: false,
      areMultipleShotgunsAllowed: this.areMultipleShotgunsAllowed,
      shotguns: this.shotguns,
      expense,
    });
  }

  closeShotguns(): OnGoingSharedMealBuilder {
    if (!this.areShotgunsOpen) throw new ShotgunsAlreadyClosed();

    return OnGoingSharedMealBuilder.build({
      id: this.id,
      meal: this.meal,
      chef: this.chef,
      areShotgunsOpen: false,
      areMultipleShotgunsAllowed: this.areMultipleShotgunsAllowed,
      shotguns: this.shotguns,
    });
  }

  openShotguns(): OnGoingSharedMealBuilder {
    if (this.areShotgunsOpen) throw new ShotgunsAlreadyOpened();

    return OnGoingSharedMealBuilder.build({
      id: this.id,
      meal: this.meal,
      chef: this.chef,
      areShotgunsOpen: true,
      areMultipleShotgunsAllowed: this.areMultipleShotgunsAllowed,
      shotguns: this.shotguns,
    });
  }

  allowMultipleShotguns(): OnGoingSharedMealBuilder {
    if (this.areMultipleShotgunsAllowed)
      throw new MultipleShotgunsAlreadyAllowed();

    return OnGoingSharedMealBuilder.build({
      id: this.id,
      meal: this.meal,
      chef: this.chef,
      areShotgunsOpen: this.areShotgunsOpen,
      areMultipleShotgunsAllowed: true,
      shotguns: this.shotguns,
    });
  }

  disallowMultipleShotguns(): OnGoingSharedMealBuilder {
    if (!this.areMultipleShotgunsAllowed)
      throw new MultipleShotgunsAlreadyDisallowed();

    const shotguns = this._shotguns.removeMultipleShotguns();
    return new OnGoingSharedMealBuilder(
      this.id,
      this.meal,
      this.chef,
      this.areShotgunsOpen,
      false,
      shotguns,
    );
  }

  isChef(adherent: Adherent["id"]): boolean {
    return adherent === this.chef.id;
  }
}
