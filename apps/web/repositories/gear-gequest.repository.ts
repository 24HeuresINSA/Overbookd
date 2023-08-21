import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { EventGearRequest } from "~/utils/models/gear-request.model";

export type Context = { $axios: NuxtAxiosInstance };

export class GearRequestRepository {
  private static readonly basePath = "gear-requests";

  static getGearRequests(context: Context) {
    return context.$axios.get<EventGearRequest[]>(this.basePath);
  }
}
