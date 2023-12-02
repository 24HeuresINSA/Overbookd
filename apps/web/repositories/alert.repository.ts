import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Alerts } from "@overbookd/alerts";
import { HttpStringified } from "@overbookd/http";

export type Context = { $axios: NuxtAxiosInstance };

export class AlertRepository {
  private static readonly basePath = "alerts";

  static getMyAlerts(context: Context) {
    return context.$axios.get<HttpStringified<Alerts>>(this.basePath);
  }
}
