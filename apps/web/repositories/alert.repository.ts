import { Alerts } from "@overbookd/alerts";
import { HttpStringified } from "@overbookd/http";
import { Context } from "./context";

export class AlertRepository {
  private static readonly basePath = "alerts";

  static getMyAlerts(context: Context) {
    return context.$axios.get<HttpStringified<Alerts>>(this.basePath);
  }
}
