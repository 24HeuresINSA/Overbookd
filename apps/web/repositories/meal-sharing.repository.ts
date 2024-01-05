import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { HttpStringified, OfferMeal } from "@overbookd/http";
import { SharedMeal } from "@overbookd/personal-account";

export type Context = { $axios: NuxtAxiosInstance };

export class MealSharingRepository {
  private static readonly basePath = "shared-meals";

  static offer(context: Context, meal: OfferMeal) {
    return context.$axios.post<HttpStringified<SharedMeal>>(
      this.basePath,
      meal,
    );
  }

  static find(context: Context, mealId: number) {
    return context.$axios.get<HttpStringified<SharedMeal>>(
      `${this.basePath}/${mealId}`,
    );
  }

  static all(context: Context) {
    return context.$axios.get<HttpStringified<SharedMeal[]>>(this.basePath);
  }
}
