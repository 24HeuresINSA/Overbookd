import type { IProvidePeriod } from "@overbookd/time";
import type { OverClicScore } from "@overbookd/volunteer-availability";
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

  static async getOverClicHighScores() {
    return HttpClient.get<OverClicScore[]>(`${this.basePath}/overclic/scores`);
  }

  static async saveOverClicScore(score: number) {
    return HttpClient.post<OverClicScore[]>(
      `${this.basePath}/overclic/scores`,
      { score },
    );
  }
}
