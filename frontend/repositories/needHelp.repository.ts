import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Volunteer } from "~/utils/models/needHelp";
import { Period } from "~/utils/models/period";
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
