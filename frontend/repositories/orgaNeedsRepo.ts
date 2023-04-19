import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { OrgaNeedsResponse } from "~/store/orgaNeeds";
import { Period } from "~/utils/models/period";
import { HttpStringified } from "~/utils/types/http";

type Context = { $axios: NuxtAxiosInstance };

export class OrgaNeedsRepository {
  private static readonly basePath = "orga-needs";

  static fetchStats(context: Context, period: Period) {
    return context.$axios.post<HttpStringified<OrgaNeedsResponse[]>>(
      this.basePath,
      period
    );
  }
}
