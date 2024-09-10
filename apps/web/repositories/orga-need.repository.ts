import type { OrgaNeedDetails, OrgaNeedRequest } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class OrgaNeedRepository {
  private static readonly basePath = "orga-needs";

  static fetchStats(periodAndTeams: OrgaNeedRequest) {
    return HttpClient.get<OrgaNeedDetails[]>({
      path: this.basePath,
      params: periodAndTeams,
    });
  }
}
