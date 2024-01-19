import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { GearDetails, GearPreview, HttpStringified } from "@overbookd/http";

export type Context = { $axios: NuxtAxiosInstance };

export class LogisticDashboardRepository {
  private static readonly basePath = "logistic/dashboard";

  static getPreviews(context: Context) {
    return context.$axios.get<GearPreview[]>(this.basePath);
  }

  static getDetails(context: Context, slug: string, start: Date, end: Date) {
    return context.$axios.get<HttpStringified<GearDetails[]>>(
      `${this.basePath}/${slug}?start=${start}&end=${end}`,
    );
  }
}
