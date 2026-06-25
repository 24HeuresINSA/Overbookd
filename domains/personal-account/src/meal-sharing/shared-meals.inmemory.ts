import {
  SharedMealBuilder,
  SharedMealCreation,
  SharedMeals,
} from "./meal-sharing.js";
import { OnGoingSharedMealBuilder } from "./on-going-shared-meal.builder.js";
import { PastSharedMealBuilder } from "./past-shared-meal.builder.js";
import { numberGenerator, updateItemToList } from "@overbookd/list";
import {
  OnGoingSharedMeal,
  PastSharedMeal,
  SharedMeal,
} from "./meals.model.js";
import { Adherent } from "./adherent.js";

export class InMemorySharedMeals implements SharedMeals {
  private idGenerator: Generator<number>;

  constructor(private sharedMeals: SharedMealBuilder[] = []) {
    this.idGenerator = numberGenerator(sharedMeals.length + 1);
  }

  find(mealId: SharedMeal["id"]): Promise<SharedMealBuilder | undefined> {
    return Promise.resolve(this.sharedMeals.find((meal) => meal.id === mealId));
  }

  create(meal: SharedMealCreation): Promise<OnGoingSharedMealBuilder> {
    const id = this.idGenerator.next().value;
    const sharedMeal = OnGoingSharedMealBuilder.init({ ...meal, id });
    this.sharedMeals = [...this.sharedMeals, sharedMeal];

    return Promise.resolve(sharedMeal);
  }

  async cancel(mealId: SharedMeal["id"]): Promise<void> {
    this.sharedMeals = this.sharedMeals.filter(({ id }) => id !== mealId);
  }

  close(meal: PastSharedMeal): Promise<PastSharedMeal> {
    return this.save(PastSharedMealBuilder.build(meal));
  }

  listAll(): Promise<SharedMeal[]> {
    return Promise.resolve(this.sharedMeals);
  }

  listAllOnGoing(): Promise<OnGoingSharedMeal[]> {
    return Promise.resolve(
      this.sharedMeals.filter(
        (sharedMeal) => sharedMeal instanceof OnGoingSharedMealBuilder,
      ),
    );
  }

  listAllPast(): Promise<PastSharedMeal[]> {
    return Promise.resolve(
      this.sharedMeals.filter(
        (sharedMeal) => sharedMeal instanceof PastSharedMealBuilder,
      ),
    );
  }

  listPastWithAdherent(adherentId: Adherent["id"]): Promise<PastSharedMeal[]> {
    return Promise.resolve(
      this.sharedMeals
        .filter((sharedMeal) => sharedMeal instanceof PastSharedMealBuilder)
        .filter(
          ({ chef, shotguns }) =>
            chef.id === adherentId ||
            shotguns.some(({ id }) => id === adherentId),
        ),
    );
  }

  addPortion(meal: OnGoingSharedMeal): Promise<OnGoingSharedMeal> {
    return this.save(OnGoingSharedMealBuilder.build(meal));
  }

  removePortion(meal: OnGoingSharedMeal): Promise<OnGoingSharedMeal> {
    return this.save(OnGoingSharedMealBuilder.build(meal));
  }

  cancelShotgun(meal: OnGoingSharedMeal): Promise<OnGoingSharedMeal> {
    return this.save(OnGoingSharedMealBuilder.build(meal));
  }

  closeShotguns(meal: OnGoingSharedMeal): Promise<OnGoingSharedMeal> {
    return this.save(OnGoingSharedMealBuilder.build(meal));
  }

  openShotguns(meal: OnGoingSharedMeal): Promise<OnGoingSharedMeal> {
    return this.save(OnGoingSharedMealBuilder.build(meal));
  }

  allowMultipleShotguns(meal: OnGoingSharedMeal): Promise<OnGoingSharedMeal> {
    return this.save(OnGoingSharedMealBuilder.build(meal));
  }

  disallowMultipleShotguns(
    meal: OnGoingSharedMeal,
  ): Promise<OnGoingSharedMeal> {
    return this.save(OnGoingSharedMealBuilder.build(meal));
  }

  private save<T extends SharedMealBuilder>(meal: T): Promise<T> {
    const mealIndex = this.sharedMeals.findIndex(({ id }) => id === meal.id);
    const sharedMeal = this.sharedMeals.at(mealIndex);
    if (mealIndex === -1 || !sharedMeal) throw new Error("meal not found");

    this.sharedMeals = updateItemToList(this.sharedMeals, mealIndex, meal);
    return Promise.resolve(meal);
  }

  all(): SharedMealBuilder[] {
    return this.sharedMeals;
  }
}
