import { Period } from "@overbookd/period";
import { Volunteer } from "~/utils/models/need-help.model";
import { HttpStringified } from "@overbookd/http";
import { Context } from "./context";

export class NeedHelpRepository {
  private static readonly basePath = "need-help";

  static getAvailableVolunteers(context: Context, period: Period) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(this.basePath, {
      params: { ...period },
    });
  }
}
