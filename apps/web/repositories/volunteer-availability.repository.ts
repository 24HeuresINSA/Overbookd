import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Period } from "@overbookd/period";
import { HttpStringified } from "@overbookd/http";

export type Context = { $axios: NuxtAxiosInstance };

export class VolunteerAvailabilityRepository {
  private static readonly basePath = "volunteer-availability";

  static async getVolunteerAvailabilities(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<Period[]>>(
      `${this.basePath}/${userId}`,
    );
  }

  static async updateVolunteerAvailabilities(
    context: Context,
    userId: number,
    availabilities: Period[],
  ) {
    return context.$axios.post<HttpStringified<Period[]>>(
      `${this.basePath}/${userId}`,
      { availabilities },
    );
  }

  static async overrideVolunteerAvailabilities(
    context: Context,
    userId: number,
    availabilities: Period[],
  ) {
    return context.$axios.patch<HttpStringified<Period[]>>(
      `${this.basePath}/${userId}`,
      { availabilities },
    );
  }
}
