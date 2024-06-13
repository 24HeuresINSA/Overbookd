import { Period } from "@overbookd/period";
import { HttpClient } from "~/utils/http/http-client";

export class VolunteerAvailabilityRepository {
  private static readonly basePath = "volunteer-availability";

  static async getVolunteerAvailabilities(userId: number) {
    return HttpClient.get<Period[]>(`${this.basePath}/${userId}`);
  }

  static async updateVolunteerAvailabilities(
    userId: number,
    availabilities: Period[],
  ) {
    return HttpClient.post<Period[]>(
      `${this.basePath}/${userId}`,
      availabilities,
    );
  }

  static async overrideVolunteerAvailabilities(
    userId: number,
    availabilities: Period[],
  ) {
    return HttpClient.patch<Period[]>(
      `${this.basePath}/${userId}`,
      availabilities,
    );
  }
}
