import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Period } from "@overbookd/period";
import { Volunteer } from "~/utils/models/needHelp";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

export class NeedHelpRepository {
  private static readonly basePath = "need-help";

  static getAvailableVolunteers(context: Context, period: Period) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(this.basePath, {
      params: { ...period },
    });
  }
}
