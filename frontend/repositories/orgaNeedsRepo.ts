import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { OrgaNeedsResponse } from "~/store/orgaNeeds";
import { Period } from "~/utils/models/period";

type Context = { $axios: NuxtAxiosInstance };

export class OrgaNeedsRepository {
  private static readonly basePath = "orga-needs";

  static fetchStats(context: Context, period: Period) {
    return context.$axios.post<OrgaNeedsResponse[]>(this.basePath, period);
  }
}
