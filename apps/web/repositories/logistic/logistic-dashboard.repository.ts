import type {
  GearPreview,
  GearSearchOptions,
  GearWithDetails,
} from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class LogisticDashboardRepository {
  private static readonly basePath = "logistic/dashboard";

  static getPreviews(searchOptions?: GearSearchOptions) {
    return HttpClient.get<GearPreview[]>({
      path: this.basePath,
      params: searchOptions,
    });
  }

  static getDetails(slug: string, start: Date, end: Date) {
    const params = { start, end };
    return HttpClient.get<GearWithDetails>({
      path: `${this.basePath}/${slug}`,
      params,
    });
  }
}
