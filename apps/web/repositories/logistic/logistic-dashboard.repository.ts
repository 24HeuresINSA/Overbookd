import { CSV, type GearPreview, type GearWithDetails } from "@overbookd/http";
import type { GearSearchOptions } from "@overbookd/logistic";
import type { IProvidePeriod } from "@overbookd/time";
import { HttpClient } from "~/utils/http/http-client";

export class LogisticDashboardRepository {
  private static readonly basePath = "logistic/dashboard";

  static getPreviews(
    period: IProvidePeriod,
    searchOptions?: GearSearchOptions,
  ) {
    return HttpClient.get<GearPreview[]>({
      path: this.basePath,
      params: { ...searchOptions, ...period },
    });
  }

  static getDetails(slug: string, period: IProvidePeriod) {
    return HttpClient.get<GearWithDetails>({
      path: `${this.basePath}/${slug}`,
      params: period,
    });
  }

  static getCSVRequirements() {
    return HttpClient.get<string>(`${this.basePath}/export`, {
      acceptedType: CSV,
    });
  }
}
