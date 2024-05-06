import { Period } from "@overbookd/period";
import { HelpingVolunteer, HttpStringified } from "@overbookd/http";
import { Context } from "./context";

export class NeedHelpRepository {
  private static readonly basePath = "need-help";

  static getAvailableVolunteers(context: Context, period: Period) {
    return context.$axios.get<HttpStringified<HelpingVolunteer[]>>(
      this.basePath,
      {
        params: { ...period },
      },
    );
  }
}
