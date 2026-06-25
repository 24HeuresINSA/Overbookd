import type { Adherent, Shotgun } from "./adherent.js";
import { Shotguns } from "./adherent.js";
import type { PastSharedMeal, AboutMeal, Expense } from "./meals.model.js";
import {
  MealSharingError,
  RecordExpenseOnPastMeal,
} from "./meal-sharing.error.js";
import { SharedMealBuilder } from "./meal-sharing.js";

export const ADD_PORTION_PAST_MEAL_ERROR =
  "Ce repas partagé a été cloturé, il n'est plus possible de shotgun une portion";
export const REMOVE_PORTION_PAST_MEAL_ERROR =
  "Ce repas partagé a été cloturé, il n'est plus possible de retirer une portion";
export const CANCEL_SHOTGUN_PAST_MEAL_ERROR =
  "Ce repas partagé a été cloturé, il n'est plus possible d'annuler un shotgun";

export const CLOSE_SHOTGUNS_PAST_MEAL_ERROR =
  "Ce repas partagé a été cloturé, il n'est plus possible de fermer les shotguns";
export const OPEN_SHOTGUNS_PAST_MEAL_ERROR =
  "Ce repas partagé a été cloturé, il n'est plus possible d'ouvrir les shotguns";

export const ALLOW_MULTIPLE_SHOTGUNS_PAST_MEAL_ERROR =
  "Ce repas partagé a été cloturé, il n'est plus possible d'autoriser les shotguns multiples";
export const DISALLOW_MULTIPLE_SHOTGUNS_PAST_MEAL_ERROR =
  "Ce repas partagé a été cloturé, il n'est plus possible de retirer les shotguns multiples";

class PastMealError extends MealSharingError {
  static get addPortion(): PastMealError {
    return new PastMealError(ADD_PORTION_PAST_MEAL_ERROR);
  }

  static get removePortion(): PastMealError {
    return new PastMealError(REMOVE_PORTION_PAST_MEAL_ERROR);
  }

  static get cancelShotgun(): PastMealError {
    return new PastMealError(CANCEL_SHOTGUN_PAST_MEAL_ERROR);
  }

  static get closeShotguns(): PastMealError {
    return new PastMealError(CLOSE_SHOTGUNS_PAST_MEAL_ERROR);
  }

  static get openShotguns(): PastMealError {
    return new PastMealError(OPEN_SHOTGUNS_PAST_MEAL_ERROR);
  }

  static get allowMultipleShotguns(): PastMealError {
    return new PastMealError(ALLOW_MULTIPLE_SHOTGUNS_PAST_MEAL_ERROR);
  }

  static get disallowMultipleShotguns(): PastMealError {
    return new PastMealError(DISALLOW_MULTIPLE_SHOTGUNS_PAST_MEAL_ERROR);
  }
}

type BuildPastSharedMeal = {
  id: number;
  createdAt: Date;
  meal: AboutMeal;
  chef: Adherent;
  expense: Expense;
  closedAt: Date;
  areShotgunsOpen: boolean;
  areMultipleShotgunsAllowed: boolean;
  shotguns: Shotgun[];
};

export class PastSharedMealBuilder
  extends SharedMealBuilder
  implements PastSharedMeal
{
  protected constructor(
    readonly id: number,
    readonly createdAt: Date,
    readonly meal: AboutMeal,
    readonly chef: Adherent,
    readonly areShotgunsOpen: boolean,
    readonly areMultipleShotgunsAllowed: boolean,
    protected readonly _shotguns: Shotguns,
    readonly expense: Expense,
    readonly closedAt: Date,
  ) {
    super(
      id,
      createdAt,
      meal,
      chef,
      areShotgunsOpen,
      areMultipleShotgunsAllowed,
      _shotguns,
    );
  }

  static build(builder: BuildPastSharedMeal): PastSharedMealBuilder {
    const {
      id,
      createdAt,
      meal,
      chef,
      areShotgunsOpen,
      areMultipleShotgunsAllowed,
      shotguns: shotgunList,
      expense,
      closedAt,
    } = builder;
    const shotguns = Shotguns.build(shotgunList);
    return new PastSharedMealBuilder(
      id,
      createdAt,
      meal,
      chef,
      areShotgunsOpen,
      areMultipleShotgunsAllowed,
      shotguns,
      expense,
      closedAt,
    );
  }

  addPortionFor(): PastSharedMealBuilder {
    throw PastMealError.addPortion;
  }

  removePortionFor(): PastSharedMealBuilder {
    throw PastMealError.removePortion;
  }

  cancelShotgunFor(): PastSharedMealBuilder {
    throw PastMealError.cancelShotgun;
  }

  close(): PastSharedMeal {
    throw new RecordExpenseOnPastMeal();
  }

  closeShotguns(): PastSharedMealBuilder {
    throw PastMealError.closeShotguns;
  }

  openShotguns(): PastSharedMealBuilder {
    throw PastMealError.openShotguns;
  }

  allowMultipleShotguns(): PastSharedMealBuilder {
    throw PastMealError.allowMultipleShotguns;
  }

  disallowMultipleShotguns(): PastSharedMealBuilder {
    throw PastMealError.disallowMultipleShotguns;
  }
}
