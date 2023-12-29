import { SharedMealBuilder, SharedMeals } from "./meal-sharing";
import { OnGoingSharedMealBuilder } from "./on-going-shared-meal.builder";
import { SharedMealCreation } from "./meal-sharing";
import { PastSharedMealBuilder } from "./past-shared-meal.builder";
import { numberGenerator, updateItemToList } from "@overbookd/list";
import { OnGoingSharedMeal, PastSharedMeal, SharedMeal } from "./meals.model";

export class InMemorySharedMeals implements SharedMeals {
  private idGenerator: Generator<number>;

  constructor(private sharedMeals: SharedMealBuilder[] = []) {
    this.idGenerator = numberGenerator(sharedMeals.length + 1);
  }

  find(mealId: number): Promise<SharedMealBuilder | undefined> {
    return Promise.resolve(this.sharedMeals.find((meal) => meal.id === mealId));
  }

  create(meal: SharedMealCreation): Promise<OnGoingSharedMealBuilder> {
    const id = this.idGenerator.next().value;
    const sharedMeal = OnGoingSharedMealBuilder.init({ ...meal, id });
    this.sharedMeals = [...this.sharedMeals, sharedMeal];

    return Promise.resolve(sharedMeal);
  }

  close(meal: PastSharedMeal): Promise<PastSharedMeal> {
    return this.save(PastSharedMealBuilder.build(meal));
  }

  list(): Promise<SharedMeal[]> {
    return Promise.resolve(this.sharedMeals);
  }

  addShotgun(meal: OnGoingSharedMeal): Promise<OnGoingSharedMeal> {
    return this.save(OnGoingSharedMealBuilder.build(meal));
  }

  private save<T extends SharedMealBuilder>(meal: T): Promise<T> {
    const mealIndex = this.sharedMeals.findIndex(({ id }) => id === meal.id);
    const sharedMeal = this.sharedMeals.at(mealIndex);
    if (mealIndex === -1 || !sharedMeal) throw new Error("meal not found");

    this.sharedMeals = updateItemToList(this.sharedMeals, mealIndex, meal);
    return Promise.resolve(meal);
  }
}
