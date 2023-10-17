import { Adherent } from "./adherent";
import { isPastMeal } from "./meals.model";
import { IExposeSharedMeal, IExposePastMeal } from "./meals.model";
import {
  ChefNotFound,
  MealNotFound,
  GuestNotFound,
} from "./meal-sharing.error";
import { Expense } from "./meals.model";

export const SOIR = "SOIR";
export const MIDI = "MIDI";

export type Moment = typeof SOIR | typeof MIDI;

export type IDefineMealDate = { day: Date; moment: Moment };

export type SharedMealCreation = {
  chef: Adherent;
  menu: string;
  date: IDefineMealDate;
};

export type SharedMeals = {
  create(meal: SharedMealCreation): Promise<IExposeSharedMeal>;
  find(
    mealId: number,
  ): Promise<IExposeSharedMeal | IExposePastMeal | undefined>;
  close(meal: IExposePastMeal): Promise<IExposePastMeal>;
};

export type Adherents = {
  find(id: number): Promise<Adherent | undefined>;
};

export class MealSharing {
  constructor(private sharedMeals: SharedMeals, private adherents: Adherents) {}

  async offer(
    menu: string,
    date: IDefineMealDate,
    chefId: number,
  ): Promise<IExposeSharedMeal> {
    const chef = await this.adherents.find(chefId);
    if (!chef) return Promise.reject(new ChefNotFound(chefId));

    return this.sharedMeals.create({ menu, date, chef });
  }

  async shotgun(mealId: number, guestId: number): Promise<IExposeSharedMeal> {
    const [sharedMeal, guest] = await Promise.all([
      this.sharedMeals.find(mealId),
      this.adherents.find(guestId),
    ]);
    if (!sharedMeal) throw new MealNotFound(mealId);
    if (!guest) throw new GuestNotFound(guestId);

    return sharedMeal.shotgunFor(guest);
  }

  async howManyShotgunsFor(mealId: number): Promise<number> {
    const meal = await this.sharedMeals.find(mealId);
    if (!meal) throw new MealNotFound(mealId);

    return meal.shotguns;
  }

  async recordExpense(
    mealId: number,
    expense: Expense,
  ): Promise<IExposePastMeal> {
    const meal = await this.sharedMeals.find(mealId);

    if (!meal) throw new MealNotFound(mealId);
    if (isPastMeal(meal)) return meal;

    const pastSharedMeal = meal.close(expense);
    return this.sharedMeals.close(pastSharedMeal);
  }
}
