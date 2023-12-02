import { Period } from "@overbookd/period";
import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { TimelineEvent } from "~/utils/models/timeline.model";
import { HttpStringified } from "@overbookd/http";

export type Context = { $axios: NuxtAxiosInstance };

export class TimelineRepository {
  private static readonly basePath = "timeline";

  static getEvents(context: Context, period: Period) {
    return context.$axios.get<HttpStringified<TimelineEvent[]>>(this.basePath, {
      params: { ...period },
    });
  }
}
