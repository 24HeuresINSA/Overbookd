import type { IProvidePeriod } from "@overbookd/time";
import type { HelpingVolunteer } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class NeedHelpRepository {
  private static readonly basePath = "need-help";

  static getAvailableVolunteers(period: IProvidePeriod) {
    return HttpClient.get<HelpingVolunteer[]>({
      path: this.basePath,
      params: period,
    });
  }
}
