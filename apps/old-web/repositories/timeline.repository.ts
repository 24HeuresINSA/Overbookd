import { Period } from "@overbookd/period";
import { HttpStringified, TimelineEvent } from "@overbookd/http";
import { Context } from "../utils/api/axios";

export class TimelineRepository {
  private static readonly basePath = "timeline";

  static getEvents(context: Context, period: Period) {
    return context.$axios.get<HttpStringified<TimelineEvent[]>>(this.basePath, {
      params: { ...period },
    });
  }
}
