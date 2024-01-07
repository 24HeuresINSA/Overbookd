import { OfferMeal } from "@overbookd/http";
import {
  Adherent,
  Expense,
  MealSharing,
  OnGoingSharedMeal,
  PastSharedMeal,
  SharedMeal,
  isPastMeal,
} from "@overbookd/personal-account";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { DomainEventService } from "../domain-event/domain-event.service";
import { SHARED_MEAL_CLOSED } from "@overbookd/domain-events";

export class SharedMealService {
  constructor(
    private readonly mealSharing: MealSharing,
    private readonly eventStore: DomainEventService,
  ) {}

  async offer(meal: OfferMeal, chef: JwtPayload): Promise<OnGoingSharedMeal> {
    const created = await this.mealSharing.offer(meal.menu, meal.date, chef.id);
    return formatCreatedMeal(created);
  }

  async find(mealId: SharedMeal["id"]): Promise<SharedMeal> {
    const found = await this.mealSharing.findById(mealId);
    return formatSharedMeal(found);
  }

  async all(): Promise<SharedMeal[]> {
    const meals = await this.mealSharing.findAll();
    return meals.map(formatSharedMeal);
  }

  async shotgun(
    mealId: SharedMeal["id"],
    guestId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const updated = await this.mealSharing.shotgun(mealId, guestId);
    return formatSharedMeal(updated);
  }

  async recordExpense(
    mealId: SharedMeal["id"],
    user: JwtPayload,
    expense: Expense,
  ): Promise<PastSharedMeal> {
    const pastMeal = await this.mealSharing.recordExpense(
      mealId,
      user.id,
      expense,
    );
    this.eventStore.publish({ data: pastMeal, type: SHARED_MEAL_CLOSED });
    return formatSharedMeal(pastMeal);
  }
}

function formatCreatedMeal(meal: OnGoingSharedMeal): OnGoingSharedMeal {
  return {
    id: meal.id,
    chef: meal.chef,
    meal: meal.meal,
    shotgunCount: meal.shotgunCount,
    shotguns: meal.shotguns,
  };
}

function formatSharedMeal<T extends SharedMeal>(meal: T): T {
  const baseMeal: OnGoingSharedMeal = {
    id: meal.id,
    chef: meal.chef,
    meal: meal.meal,
    shotgunCount: meal.shotgunCount,
    shotguns: meal.shotguns,
  };

  if (!isPastMeal(meal)) return baseMeal as T;

  return { ...baseMeal, expense: meal.expense } as T;
}
