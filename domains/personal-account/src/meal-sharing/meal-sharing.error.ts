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
export class OnlyChefCan extends MealSharingError {
  private constructor(chef: Adherent, action: string) {
    super(`Seul le.a chef.fe ${chef.name} peut ${action}`);
  }

  static recordExpenseFor({ chef }: SharedMeal) {
    return new OnlyChefCan(chef, "renseigner une dépense");
  }

  static cancel({ chef }: SharedMeal) {
    return new OnlyChefCan(chef, "annuler un repas");
  }

  static closeShotguns({ chef }: SharedMeal) {
    return new OnlyChefCan(chef, "fermer les shotguns");
  }

  static openShotguns({ chef }: SharedMeal) {
    return new OnlyChefCan(chef, "ouvrir les shotguns");
  }

  static cancelShotgunFor({ chef }: SharedMeal) {
    return new OnlyChefCan(
      chef,
      "annuler un shotgun quand les shotguns sont fermés",
    );
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

export class ShotgunsClosed extends MealSharingError {
  constructor() {
    super("Il n'est pas possible de shotgun lorsque ceux-ci sont fermés");
  }
}

export class ShotgunsAlreadyClosed extends MealSharingError {
  constructor() {
    super("Les shotguns sont déjà fermés");
  }
}

export class ShotgunsAlreadyOpened extends MealSharingError {
  constructor() {
    super("Les shotguns sont déjà ouverts");
  }
}
