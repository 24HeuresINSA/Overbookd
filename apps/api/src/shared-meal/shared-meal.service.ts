import {
  Adherent,
  MealDate,
  MealSharing,
  OnGoingSharedMeal,
  SharedMeal,
} from "@overbookd/personal-account";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

export type OfferMeal = {
  menu: string;
  date: MealDate;
};

export class SharedMealService {
  constructor(private readonly mealSharing: MealSharing) {}

  async offer(meal: OfferMeal, chef: JwtPayload): Promise<OnGoingSharedMeal> {
    const created = await this.mealSharing.offer(meal.menu, meal.date, chef.id);
    return formatSharedMeal(created);
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
}

function formatSharedMeal(created: OnGoingSharedMeal): OnGoingSharedMeal {
  return {
    id: created.id,
    chef: created.chef,
    meal: created.meal,
    shotgunCount: created.shotgunCount,
    shotguns: created.shotguns,
  };
}
