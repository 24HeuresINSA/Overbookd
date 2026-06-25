import { Adherent, Shotgun, Shotguns } from "./adherent.js";
import {
  AboutMeal,
  MAX_SHARED_MEAL_EXPENSE_AMOUNT,
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
  AmountTooLow,
  AmountTooHigh,
} from "./meal-sharing.error.js";
import { Expense } from "./meals.model.js";
import { DateString } from "@overbookd/time";

export const SOIR = "SOIR";
export const MIDI = "MIDI";

export type Moment = typeof SOIR | typeof MIDI;

export type MealDate = { day: DateString; moment: Moment };

export type SharedMealCreation = {
  chef: Adherent;
  menu: string;
  date: MealDate;
  areMultipleShotgunsAllowed: boolean;
};

export abstract class SharedMealBuilder {
  protected constructor(
    readonly id: number,
    readonly createdAt: Date,
    readonly meal: AboutMeal,
    readonly chef: Adherent,
    readonly areShotgunsOpen: boolean,
    readonly areMultipleShotgunsAllowed: boolean,
    protected readonly _shotguns: Shotguns,
  ) {}

  abstract addPortionFor(adherent: Adherent): SharedMealBuilder;

  abstract removePortionFor(guest: Adherent["id"]): SharedMealBuilder;

  abstract cancelShotgunFor(guest: Adherent["id"]): SharedMealBuilder;

  abstract close(expense: Expense): PastSharedMeal;

  abstract cancelMeal(): void;

  abstract closeShotguns(): SharedMealBuilder;

  abstract openShotguns(): SharedMealBuilder;

  abstract allowMultipleShotguns(): SharedMealBuilder;

  abstract disallowMultipleShotguns(): SharedMealBuilder;

  get shotguns(): Shotgun[] {
    return this._shotguns.all;
  }

  get portionCount(): number {
    return this._shotguns.portionCount;
  }

  isChef(adherent: Adherent["id"]): boolean {
    return adherent === this.chef.id;
  }
}

export type SharedMeals = {
  create(meal: SharedMealCreation): Promise<OnGoingSharedMeal>;
  cancel(mealId: SharedMeal["id"]): Promise<void>;
  find(mealId: SharedMeal["id"]): Promise<SharedMealBuilder | undefined>;
  close(meal: PastSharedMeal): Promise<PastSharedMeal>;
  listAll(): Promise<SharedMeal[]>;
  listAllOnGoing(): Promise<OnGoingSharedMeal[]>;
  listAllPast(): Promise<PastSharedMeal[]>;
  listPastWithAdherent(adherentId: Adherent["id"]): Promise<PastSharedMeal[]>;
  addPortion(updatedMeal: OnGoingSharedMeal): Promise<OnGoingSharedMeal>;
  removePortion(updatedMeal: OnGoingSharedMeal): Promise<OnGoingSharedMeal>;
  cancelShotgun(updatedMeal: OnGoingSharedMeal): Promise<OnGoingSharedMeal>;
  closeShotguns(updatedMeal: OnGoingSharedMeal): Promise<OnGoingSharedMeal>;
  openShotguns(updatedMeal: OnGoingSharedMeal): Promise<OnGoingSharedMeal>;
  allowMultipleShotguns(
    updatedMeal: OnGoingSharedMeal,
  ): Promise<OnGoingSharedMeal>;
  disallowMultipleShotguns(
    updatedMeal: OnGoingSharedMeal,
  ): Promise<OnGoingSharedMeal>;
};

export type Adherents = {
  find(id: Adherent["id"]): Promise<Adherent | undefined>;
};

type RemoveShotgun = {
  mealId: SharedMeal["id"];
  guestId: Adherent["id"];
};

export class MealSharing {
  constructor(
    private sharedMeals: SharedMeals,
    private adherents: Adherents,
  ) {}

  async offer(
    menu: string,
    date: MealDate,
    chefId: Adherent["id"],
    areMultipleShotgunsAllowed: boolean,
  ): Promise<OnGoingSharedMeal> {
    const chef = await this.adherents.find(chefId);
    if (!chef) return Promise.reject(new ChefNotFound(chefId));

    return this.sharedMeals.create({
      menu,
      date,
      chef,
      areMultipleShotgunsAllowed,
    });
  }

  async addPortion(
    mealId: SharedMeal["id"],
    guestId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const [sharedMeal, guest] = await Promise.all([
      this.sharedMeals.find(mealId),
      this.adherents.find(guestId),
    ]);
    if (!sharedMeal) throw new MealNotFound(mealId);
    if (!guest) throw new GuestNotFound(guestId);

    const updatedMeal = sharedMeal.addPortionFor(guest);
    return this.sharedMeals.addPortion(updatedMeal);
  }

  async removePortion(
    { mealId, guestId }: RemoveShotgun,
    instigatorId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const sharedMeal = await this.sharedMeals.find(mealId);
    if (!sharedMeal) throw new MealNotFound(mealId);
    if (!sharedMeal.isChef(instigatorId))
      throw OnlyChefCan.removePortionFor(sharedMeal);

    const updatedMeal = sharedMeal.removePortionFor(guestId);
    return this.sharedMeals.removePortion(updatedMeal);
  }

  async cancelShotgun(
    { mealId, guestId }: RemoveShotgun,
    instigatorId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const sharedMeal = await this.sharedMeals.find(mealId);
    if (!sharedMeal) throw new MealNotFound(mealId);
    if (!sharedMeal.isChef(instigatorId))
      throw OnlyChefCan.cancelShotgunFor(sharedMeal);

    const updatedMeal = sharedMeal.cancelShotgunFor(guestId);
    return this.sharedMeals.cancelShotgun(updatedMeal);
  }

  async findById(mealId: SharedMeal["id"]): Promise<SharedMeal> {
    const sharedMeal = await this.sharedMeals.find(mealId);
    if (!sharedMeal) throw new MealNotFound(mealId);
    return sharedMeal;
  }

  async findAll(): Promise<SharedMeal[]> {
    return this.sharedMeals.listAll();
  }

  async findAllOnGoing(): Promise<OnGoingSharedMeal[]> {
    return this.sharedMeals.listAllOnGoing();
  }

  async findAllPast(): Promise<PastSharedMeal[]> {
    return this.sharedMeals.listAllPast();
  }

  async findPastWithAdherent(
    adherentId: Adherent["id"],
  ): Promise<PastSharedMeal[]> {
    return this.sharedMeals.listPastWithAdherent(adherentId);
  }

  async recordExpense(
    mealId: SharedMeal["id"],
    recorder: Adherent["id"],
    expense: Expense,
  ): Promise<PastSharedMeal> {
    const meal = await this.sharedMeals.find(mealId);

    if (!meal) throw new MealNotFound(mealId);
    if (!meal.isChef(recorder)) throw OnlyChefCan.recordExpenseFor(meal);
    if (meal.portionCount === 0) throw new RecordExpenseOnNoShotgunedMeal();
    if (expense.amount <= 0) throw new AmountTooLow();
    if (expense.amount > MAX_SHARED_MEAL_EXPENSE_AMOUNT)
      throw new AmountTooHigh();

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

    meal.cancelMeal();
    return this.sharedMeals.cancel(mealId);
  }

  async closeShotguns(
    mealId: SharedMeal["id"],
    recorder: Adherent["id"],
  ): Promise<SharedMeal> {
    const meal = await this.sharedMeals.find(mealId);

    if (!meal) throw new MealNotFound(mealId);
    if (!meal.isChef(recorder)) throw OnlyChefCan.closeShotguns(meal);

    const updatedMeal = meal.closeShotguns();
    return this.sharedMeals.closeShotguns(updatedMeal);
  }

  async openShotguns(
    mealId: SharedMeal["id"],
    recorder: Adherent["id"],
  ): Promise<SharedMeal> {
    const meal = await this.sharedMeals.find(mealId);

    if (!meal) throw new MealNotFound(mealId);
    if (!meal.isChef(recorder)) throw OnlyChefCan.openShotguns(meal);

    const updatedMeal = meal.openShotguns();
    return this.sharedMeals.openShotguns(updatedMeal);
  }

  async allowMultipleShotguns(
    mealId: SharedMeal["id"],
    recorder: Adherent["id"],
  ): Promise<SharedMeal> {
    const meal = await this.sharedMeals.find(mealId);

    if (!meal) throw new MealNotFound(mealId);
    if (!meal.isChef(recorder)) throw OnlyChefCan.allowMultipleShotguns(meal);

    const updatedMeal = meal.allowMultipleShotguns();
    return this.sharedMeals.allowMultipleShotguns(updatedMeal);
  }

  async disallowMultipleShotguns(
    mealId: SharedMeal["id"],
    recorder: Adherent["id"],
  ): Promise<SharedMeal> {
    const meal = await this.sharedMeals.find(mealId);

    if (!meal) throw new MealNotFound(mealId);
    if (!meal.isChef(recorder))
      throw OnlyChefCan.disallowMultipleShotguns(meal);

    const updatedMeal = meal.disallowMultipleShotguns();
    return this.sharedMeals.disallowMultipleShotguns(updatedMeal);
  }
}
