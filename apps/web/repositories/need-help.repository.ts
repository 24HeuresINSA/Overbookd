import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Period } from "@overbookd/period";
import { Volunteer } from "~/utils/models/need-help.model";
import { HttpStringified } from "@overbookd/http";

export type Context = { $axios: NuxtAxiosInstance };

export class NeedHelpRepository {
  private static readonly basePath = "need-help";

  static getAvailableVolunteers(context: Context, period: Period) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(this.basePath, {
      params: { ...period },
    });
  }
}
