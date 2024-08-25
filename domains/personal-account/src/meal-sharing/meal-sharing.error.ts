import { Adherent } from "./adherent.js";
import { SharedMeal } from "./meals.model.js";

export class MealSharingError extends Error {}

export class ChefNotFound extends MealSharingError {
  constructor(id: number) {
    super(`Impossible de trouver l'adhérent #${id} en tant que chef`);
  }
}

export class MealNotFound extends MealSharingError {
  constructor(id: number) {
    super(`Impossible de trouver le repas partagé #${id}`);
  }
}

export class GuestNotFound extends MealSharingError {
  constructor(id: number) {
    super(`Impossible de trouver l'adhérent #${id} en tant que convive`);
  }
}

export class AlreadyShotguned extends MealSharingError {
  constructor({ meal }: SharedMeal) {
    super(`Tu as déjà shotgun pour le repas du ${meal.date}`);
  }
}

export class OnlyChefCan extends MealSharingError {
  private constructor(chef: Adherent, action: string) {
    super(`Seul le.a chef.fe ${chef.name} peut ${action}`);
  }

  static cancelShotgunFor({ chef }: SharedMeal) {
    return new OnlyChefCan(chef, "annuler un shotgun");
  }

  static recordExpenseFor({ chef }: SharedMeal) {
    return new OnlyChefCan(chef, "renseigner une dépense");
  }

  static cancel({ chef }: SharedMeal) {
    return new OnlyChefCan(chef, "annuler un repas");
  }
}

export class RecordExpenseOnNoShotgunedMeal extends MealSharingError {
  constructor() {
    super("Il faut au moins un convive pour renseigner une dépense");
  }
}

export class RecordExpenseOnPastMeal extends MealSharingError {
  constructor() {
    super("Le repas a déjà une dépense renseignée");
  }
}
