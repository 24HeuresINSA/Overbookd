import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Period } from "~/utils/models/period";
import { TimelineEvent } from "~/utils/models/timeline";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

export class TimelineRepository {
  private static readonly basePath = "timeline";

  static getEvents(context: Context, period: Period) {
    return context.$axios.get<HttpStringified<TimelineEvent[]>>(this.basePath, {
      params: { ...period },
    });
  }
}
