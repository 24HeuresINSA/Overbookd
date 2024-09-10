import type { IProvidePeriod } from "@overbookd/time";
import type { TimelineEvent } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class TimelineRepository {
  private static readonly basePath = "timeline";

  static getEvents(period: IProvidePeriod) {
    return HttpClient.get<TimelineEvent[]>({
      path: this.basePath,
      params: period,
    });
  }
}
