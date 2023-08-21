import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { OrgaNeedsRequest, OrgaNeedsResponse } from "~/store/orgaNeeds";
import { HttpStringified } from "~/utils/types/http";

type Context = { $axios: NuxtAxiosInstance };

export class OrgaNeedsRepository {
  private static readonly basePath = "orga-needs";

  static fetchStats(context: Context, periodAndTeams: OrgaNeedsRequest) {
    return context.$axios.get<HttpStringified<OrgaNeedsResponse[]>>(
      this.basePath,
      { params: periodAndTeams },
    );
  }
}
