import { EventGearRequest } from "~/utils/models/gear-request.model";
import { Context } from "./context";

export class GearRequestRepository {
  private static readonly basePath = "gear-requests";

  static getGearRequests(context: Context) {
    return context.$axios.get<EventGearRequest[]>(this.basePath);
  }
}
