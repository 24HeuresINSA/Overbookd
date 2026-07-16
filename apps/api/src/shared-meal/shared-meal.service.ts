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
import { DomainEventService } from "../domain-event/domain-event.service";
import { SHARED_MEAL_CLOSED } from "@overbookd/domain-events";

export class SharedMealService {
  constructor(
    private readonly mealSharing: MealSharing,
    private readonly eventStore: DomainEventService,
  ) {}

  async offer(
    meal: OfferMeal,
    chefId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const created = await this.mealSharing.offer(
      meal.menu,
      meal.date,
      chefId,
      meal.areMultipleShotgunsAllowed,
    );
    return formatCreatedMeal(created);
  }

  async all(): Promise<SharedMeal[]> {
    const meals = await this.mealSharing.findAll();
    return meals.map(formatSharedMeal);
  }

  async allOnGoing(): Promise<OnGoingSharedMeal[]> {
    const meals = await this.mealSharing.findAllOnGoing();
    return meals.map(formatSharedMeal);
  }

  async allPast(): Promise<PastSharedMeal[]> {
    const meals = await this.mealSharing.findAllPast();
    return meals.map(formatSharedMeal);
  }

  async pastWithAdherent(
    adherentId: Adherent["id"],
  ): Promise<PastSharedMeal[]> {
    const meals = await this.mealSharing.findPastWithAdherent(adherentId);
    return meals.map(formatSharedMeal);
  }

  async addPortion(
    mealId: SharedMeal["id"],
    guestId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const updated = await this.mealSharing.addPortion(mealId, guestId);
    return formatSharedMeal(updated);
  }

  async removePortion(
    mealId: SharedMeal["id"],
    guestId: Adherent["id"],
    instigatorId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const updated = await this.mealSharing.removePortion(
      { mealId, guestId },
      instigatorId,
    );
    return formatSharedMeal(updated);
  }

  async cancelShotgun(
    mealId: SharedMeal["id"],
    guestId: Adherent["id"],
    instigatorId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const updated = await this.mealSharing.cancelShotgun(
      { mealId, guestId },
      instigatorId,
    );
    return formatSharedMeal(updated);
  }

  async recordExpense(
    mealId: SharedMeal["id"],
    instigatorId: Adherent["id"],
    expense: Expense,
  ): Promise<PastSharedMeal> {
    const pastMeal = await this.mealSharing.recordExpense(
      mealId,
      instigatorId,
      expense,
    );
    this.eventStore.publish({ data: pastMeal, type: SHARED_MEAL_CLOSED });
    return formatSharedMeal(pastMeal);
  }

  async cancelMeal(
    mealId: SharedMeal["id"],
    instigatorId: Adherent["id"],
  ): Promise<void> {
    await this.mealSharing.cancelMeal(mealId, instigatorId);
  }

  async closeShotguns(
    mealId: SharedMeal["id"],
    instigatorId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const updated = await this.mealSharing.closeShotguns(mealId, instigatorId);
    return formatSharedMeal(updated);
  }

  async openShotguns(
    mealId: SharedMeal["id"],
    instigatorId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const updated = await this.mealSharing.openShotguns(mealId, instigatorId);
    return formatSharedMeal(updated);
  }

  async allowMultipleShotguns(
    mealId: SharedMeal["id"],
    instigatorId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const updated = await this.mealSharing.allowMultipleShotguns(
      mealId,
      instigatorId,
    );
    return formatSharedMeal(updated);
  }

  async disallowMultipleShotguns(
    mealId: SharedMeal["id"],
    instigatorId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    const updated = await this.mealSharing.disallowMultipleShotguns(
      mealId,
      instigatorId,
    );
    return formatSharedMeal(updated);
  }
}

function formatCreatedMeal(meal: OnGoingSharedMeal): OnGoingSharedMeal {
  return {
    id: meal.id,
    createdAt: meal.createdAt,
    chef: meal.chef,
    meal: meal.meal,
    areShotgunsOpen: meal.areShotgunsOpen,
    areMultipleShotgunsAllowed: meal.areMultipleShotgunsAllowed,
    portionCount: meal.portionCount,
    shotguns: meal.shotguns,
  };
}

function formatSharedMeal<T extends SharedMeal>(meal: T): T {
  const baseMeal: OnGoingSharedMeal = {
    id: meal.id,
    createdAt: meal.createdAt,
    chef: meal.chef,
    meal: meal.meal,
    areShotgunsOpen: meal.areShotgunsOpen,
    areMultipleShotgunsAllowed: meal.areMultipleShotgunsAllowed,
    portionCount: meal.portionCount,
    shotguns: meal.shotguns,
  };

  if (!isPastMeal(meal)) return baseMeal as T;

  return { ...baseMeal, expense: meal.expense, closedAt: meal.closedAt } as T;
}
