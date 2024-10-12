import type { IProvidePeriod } from "@overbookd/time";
import { HttpClient } from "~/utils/http/http-client";

export class VolunteerAvailabilityRepository {
  private static readonly basePath = "volunteer-availability";

  static async getVolunteerAvailabilities(userId: number) {
    return HttpClient.get<IProvidePeriod[]>(`${this.basePath}/${userId}`);
  }

  static async updateVolunteerAvailabilities(
    userId: number,
    availabilities: IProvidePeriod[],
  ) {
    return HttpClient.post<IProvidePeriod[]>(`${this.basePath}/${userId}`, {
      availabilities,
    });
  }

  static async overrideVolunteerAvailabilities(
    userId: number,
    availabilities: IProvidePeriod[],
  ) {
    return HttpClient.patch<IProvidePeriod[]>(`${this.basePath}/${userId}`, {
      availabilities,
    });
  }
}
