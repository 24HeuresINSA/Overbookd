import { Adherent } from "./adherent";
import {
  OnGoingSharedMeal,
  PastSharedMeal,
  SharedMeal,
  isPastMeal,
} from "./meals.model";
import {
  ChefNotFound,
  MealNotFound,
  GuestNotFound,
  RecordExpenseByChiefOnly,
} from "./meal-sharing.error";
import { Expense } from "./meals.model";
import { OnGoingSharedMealBuilder } from "./on-going-shared-meal.builder";
import { PastSharedMealBuilder } from "./past-shared-meal.builder";

export const SOIR = "SOIR";
export const MIDI = "MIDI";

export type Moment = typeof SOIR | typeof MIDI;

export type MealDate = { day: Date; moment: Moment };

export type SharedMealCreation = {
  chef: Adherent;
  menu: string;
  date: MealDate;
};

export type SharedMealBuilder =
  | OnGoingSharedMealBuilder
  | PastSharedMealBuilder;

export type SharedMeals = {
  create(meal: SharedMealCreation): Promise<OnGoingSharedMeal>;
  find(mealId: number): Promise<SharedMealBuilder | undefined>;
  close(meal: PastSharedMeal): Promise<PastSharedMeal>;
  list(): Promise<SharedMeal[]>;
  addShotgun(updatedMeal: OnGoingSharedMeal): Promise<OnGoingSharedMeal>;
};

export type Adherents = {
  find(id: number): Promise<Adherent | undefined>;
};

export class MealSharing {
  constructor(
    private sharedMeals: SharedMeals,
    private adherents: Adherents,
  ) {}

  async offer(
    menu: string,
    date: MealDate,
    chefId: number,
  ): Promise<OnGoingSharedMeal> {
    const chef = await this.adherents.find(chefId);
    if (!chef) return Promise.reject(new ChefNotFound(chefId));

    return this.sharedMeals.create({ menu, date, chef });
  }

  async shotgun(mealId: number, guestId: number): Promise<OnGoingSharedMeal> {
    const [sharedMeal, guest] = await Promise.all([
      this.sharedMeals.find(mealId),
      this.adherents.find(guestId),
    ]);
    if (!sharedMeal) throw new MealNotFound(mealId);
    if (!guest) throw new GuestNotFound(guestId);

    const updatedMeal = sharedMeal.shotgunFor(guest);
    return this.sharedMeals.addShotgun(updatedMeal);
  }

  async findById(mealId: number): Promise<SharedMeal> {
    const sharedMeal = await this.sharedMeals.find(mealId);
    if (!sharedMeal) throw new MealNotFound(mealId);
    return sharedMeal;
  }

  async findAll(): Promise<SharedMeal[]> {
    return this.sharedMeals.list();
  }

  async recordExpense(
    mealId: SharedMeal["id"],
    recorder: Adherent["id"],
    expense: Expense,
  ): Promise<PastSharedMeal> {
    const meal = await this.sharedMeals.find(mealId);

    if (!meal) throw new MealNotFound(mealId);
    if (isPastMeal(meal)) return meal;
    if (recorder !== meal.chef.id) throw new RecordExpenseByChiefOnly(meal);

    const pastSharedMeal = meal.close(expense);
    return this.sharedMeals.close(pastSharedMeal);
  }
}
