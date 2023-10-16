import { SharedMeals } from "./meal-sharing";
import { IExposeSharedMeal } from "./meals.model";
import { SharedMeal } from "./shared-meal";
import { IExposePastMeal } from "./meals.model";
import { SharedMealCreation } from "./meal-sharing";

function* numberGenerator(start: number): Generator<number> {
  for (let i = start; i < 1_000_000; i++) {
    yield i;
  }
}

export class InMemorySharedMeals implements SharedMeals {
  private idGenerator: Generator<number>;

  constructor(
    private sharedMeals: (IExposeSharedMeal | IExposePastMeal)[] = [],
  ) {
    this.idGenerator = numberGenerator(sharedMeals.length + 1);
  }

  find(
    mealId: number,
  ): Promise<IExposeSharedMeal | IExposePastMeal | undefined> {
    return Promise.resolve(this.sharedMeals.find((meal) => meal.id === mealId));
  }

  create(meal: SharedMealCreation): Promise<IExposeSharedMeal> {
    const id = this.idGenerator.next().value;
    const sharedMeal = SharedMeal.init({ ...meal, id });
    this.sharedMeals = [...this.sharedMeals, sharedMeal];

    return Promise.resolve(sharedMeal);
  }

  close(meal: IExposePastMeal): Promise<IExposePastMeal> {
    const removeMeal = this.sharedMeals.filter(({ id }) => id !== meal.id);
    this.sharedMeals = [...removeMeal, meal];
    return Promise.resolve(meal);
  }
}
