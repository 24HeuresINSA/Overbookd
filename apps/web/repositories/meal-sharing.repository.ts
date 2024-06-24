import type { OfferMeal } from "@overbookd/http";
import type {
  Expense,
  PastSharedMeal,
  SharedMeal,
} from "@overbookd/personal-account";
import { HttpClient } from "~/utils/http/http-client";

export class MealSharingRepository {
  private static readonly basePath = "shared-meals";

  static offer(meal: OfferMeal) {
    return HttpClient.post<SharedMeal>(this.basePath, meal);
  }

  static find(mealId: SharedMeal["id"]) {
    return HttpClient.get<SharedMeal>(`${this.basePath}/${mealId}`);
  }

  static all() {
    return HttpClient.get<SharedMeal[]>(this.basePath);
  }

  static shotgun(mealId: SharedMeal["id"]) {
    return HttpClient.post<SharedMeal>(`${this.basePath}/${mealId}/shotgun`);
  }

  static recordExpense(mealId: SharedMeal["id"], expense: Expense) {
    return HttpClient.post<PastSharedMeal>(
      `${this.basePath}/${mealId}/expense`,
      expense,
    );
  }
}
