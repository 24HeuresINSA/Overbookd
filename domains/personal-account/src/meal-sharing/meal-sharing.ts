import { Adherent, Shotgun, Shotguns } from "./adherent.js";
import {
  AboutMeal,
  OnGoingSharedMeal,
  PastSharedMeal,
  SharedMeal,
} from "./meals.model.js";
import {
  ChefNotFound,
  MealNotFound,
  GuestNotFound,
  RecordExpenseOnNoShotgunedMeal,
  OnlyChefCan,
} from "./meal-sharing.error.js";
import { Expense } from "./meals.model.js";

export const SOIR = "SOIR";
export const MIDI = "MIDI";

export type Moment = typeof SOIR | typeof MIDI;

export type MealDate = { day: Date; moment: Moment };

export type SharedMealCreation = {
  chef: Adherent;
  menu: string;
  date: MealDate;
};

export abstract class SharedMealBuilder {
  protected constructor(
    readonly id: number,
    readonly meal: AboutMeal,
    readonly chef: Adherent,
    protected readonly _shotguns: Shotguns,
  ) {}

  abstract shotgunFor(adherent: Adherent): SharedMealBuilder;

  abstract cancelShotgunFor(guest: Adherent["id"]): SharedMealBuilder;

  abstract close(expense: Expense): PastSharedMeal;

  get shotguns(): Shotgun[] {
    return this._shotguns.all;
  }

  get shotgunCount(): number {
    return this._shotguns.all.length;
  }

  isChef(adherent: Adherent["id"]) {
    return adherent === this.chef.id;
  }
}

export type SharedMeals = {
  create(meal: SharedMealCreation): Promise<OnGoingSharedMeal>;
  cancel(mealId: SharedMeal["id"]): Promise<void>;
  find(mealId: number): Promise<SharedMealBuilder | undefined>;
  close(meal: PastSharedMeal): Promise<PastSharedMeal>;
  list(): Promise<SharedMeal[]>;
  addShotgun(updatedMeal: OnGoingSharedMeal): Promise<OnGoingSharedMeal>;
  cancelShotgun(updatedMeal: OnGoingSharedMeal): Promise<OnGoingSharedMeal>;
};

export type Adherents = {
  find(id: number): Promise<Adherent | undefined>;
};

type CancelShotgun = {
  mealId: number;
  guestId: number;
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

  async cancelShotgun(
    { mealId, guestId }: CancelShotgun,
    instigator: number,
  ): Promise<OnGoingSharedMeal> {
    const meal = await this.sharedMeals.find(mealId);
    if (!meal) throw new MealNotFound(mealId);
    if (!meal.isChef(instigator)) throw OnlyChefCan.cancelShotgunFor(meal);

    const updatedMeal = meal.cancelShotgunFor(guestId);
    return this.sharedMeals.cancelShotgun(updatedMeal);
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
    if (!meal.isChef(recorder)) throw OnlyChefCan.recordExpenseFor(meal);
    if (meal.shotgunCount === 0) throw new RecordExpenseOnNoShotgunedMeal();

    const pastSharedMeal = meal.close(expense);
    return this.sharedMeals.close(pastSharedMeal);
  }

  async cancelMeal(
    mealId: SharedMeal["id"],
    instigatorId: Adherent["id"],
  ): Promise<void> {
    const meal = await this.sharedMeals.find(mealId);
    if (!meal) return;
    if (!meal.isChef(instigatorId)) throw OnlyChefCan.cancel(meal);

    return this.sharedMeals.cancel(mealId);
  }
}
