import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { HttpStringified, OfferMeal } from "@overbookd/http";
import {
  Expense,
  PastSharedMeal,
  SharedMeal,
} from "@overbookd/personal-account";

export type Context = { $axios: NuxtAxiosInstance };

export class MealSharingRepository {
  private static readonly basePath = "shared-meals";

  static offer(context: Context, meal: OfferMeal) {
    return context.$axios.post<HttpStringified<SharedMeal>>(
      this.basePath,
      meal,
    );
  }

  static find(context: Context, mealId: SharedMeal["id"]) {
    return context.$axios.get<HttpStringified<SharedMeal>>(
      `${this.basePath}/${mealId}`,
    );
  }

  static all(context: Context) {
    return context.$axios.get<HttpStringified<SharedMeal[]>>(this.basePath);
  }

  static shotgun(context: Context, mealId: SharedMeal["id"]) {
    return context.$axios.post<HttpStringified<SharedMeal>>(
      `${this.basePath}/${mealId}/shotgun`,
    );
  }

  static recordExpense(
    context: Context,
    mealId: SharedMeal["id"],
    expense: Expense,
  ) {
    return context.$axios.post<HttpStringified<PastSharedMeal>>(
      `${this.basePath}/${mealId}/expense`,
      expense,
    );
  }
}
