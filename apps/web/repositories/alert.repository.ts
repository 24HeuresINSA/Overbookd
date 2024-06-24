import type { Alerts } from "@overbookd/alerts";
import { HttpClient } from "~/utils/http/http-client";

export class AlertRepository {
  private static readonly basePath = "alerts";

  static getMyAlerts() {
    return HttpClient.get<Alerts>(this.basePath);
  }
}
