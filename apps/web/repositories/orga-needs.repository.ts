import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  HttpStringified,
  OrgaNeedDetails,
  OrgaNeedRequest,
} from "@overbookd/http";

type Context = { $axios: NuxtAxiosInstance };

export class OrgaNeedsRepository {
  private static readonly basePath = "orga-needs";

  static fetchStats(context: Context, periodAndTeams: OrgaNeedRequest) {
    return context.$axios.get<HttpStringified<OrgaNeedDetails[]>>(
      this.basePath,
      { params: periodAndTeams },
    );
  }
}
