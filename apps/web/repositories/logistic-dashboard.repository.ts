import {
  GearPreview,
  GearSearchOptions,
  GearWithDetails,
  HttpStringified,
} from "@overbookd/http";
import { Context } from "./context";

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
