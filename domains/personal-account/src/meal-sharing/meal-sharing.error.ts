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

export class RecordExpenseByChefOnly extends MealSharingError {
  constructor({ chef }: SharedMeal) {
    super(`Seul le.a chef.fe ${chef.name} peut renseigner une dépense`);
  }
}

export class CancelShotgunByChefOnly extends MealSharingError {
  constructor({ chef }: SharedMeal) {
    super(`Seul le.a chef.fe ${chef.name} peut annuler un shotgun`);
  }
}

export class RecordExpenseOnNoShotgunedMeal extends MealSharingError {
  constructor() {
    super("Il faut au moins un convive pour renseigner une dépense");
  }
}
