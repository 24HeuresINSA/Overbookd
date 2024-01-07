import { SharedMeal } from "./meals.model";

export class MealSharingError extends Error {}

export class ChefNotFound extends MealSharingError {
  constructor(id: number) {
    super(`❌ Impossible de trouver l'adhérent #${id} en tant que chef`);
  }
}

export class MealNotFound extends MealSharingError {
  constructor(id: number) {
    super(`❌ Impossible de trouver le repas partagé #${id}`);
  }
}

export class GuestNotFound extends MealSharingError {
  constructor(id: number) {
    super(`❌ Impossible de trouver l'adhérent #${id} en tant que convive`);
  }
}

export class AlreadyShotguned extends MealSharingError {
  constructor({ meal }: SharedMeal) {
    super(`❌ Tu as déjà shotgun pour le repas du ${meal.date}`);
  }
}

export class RecordExpenseByChiefOnly extends MealSharingError {
  constructor({ chef }: SharedMeal) {
    super(`❌ Seul le.a chef.fe ${chef.name} peut renseigner une dépense`);
  }
}
