import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Alert } from "@overbookd/personnal-account";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

export class AlertRepository {
  private static readonly basePath = "alerts";

  static getMyAlerts(context: Context) {
    return context.$axios.get<HttpStringified<Alert[]>>(this.basePath);
  }
}
