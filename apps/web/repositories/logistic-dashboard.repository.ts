import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  GearPreview,
  GearSearchOptions,
  GearWithDetails,
  HttpStringified,
} from "@overbookd/http";

export type Context = { $axios: NuxtAxiosInstance };

export class LogisticDashboardRepository {
  private static readonly basePath = "logistic/dashboard";

  static getPreviews(context: Context, searchOptions?: GearSearchOptions) {
    return context.$axios.get<GearPreview[]>(this.basePath, {
      params: searchOptions,
    });
  }

  static getDetails(context: Context, slug: string, start: Date, end: Date) {
    return context.$axios.get<HttpStringified<GearWithDetails>>(
      `${this.basePath}/${slug}?start=${start}&end=${end}`,
    );
  }
}
