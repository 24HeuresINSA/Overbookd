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

  offer(meal: OfferMeal, chef: JwtPayload): Promise<OnGoingSharedMeal> {
    return this.mealSharing.offer(meal.menu, meal.date, chef.id);
  }

  find(mealId: SharedMeal["id"]): Promise<SharedMeal> {
    return this.mealSharing.findById(mealId);
  }

  all(): Promise<SharedMeal[]> {
    return this.mealSharing.findAll();
  }

  shotgun(
    mealId: SharedMeal["id"],
    guestId: Adherent["id"],
  ): Promise<OnGoingSharedMeal> {
    return this.mealSharing.shotgun(mealId, guestId);
  }
}
