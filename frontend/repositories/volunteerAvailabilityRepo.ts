import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Availability } from "~/domain/volunteer-availability/volunteer-availability";
import { Period } from "~/utils/models/period";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

export class VolunteerAvailabilityRepository {
  private static readonly basePath = "volunteer-availability";

  static async getVolunteerAvailabilities(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<Period[]>>(
      `${this.basePath}/${userId}`
    );
  }

  static async updateVolunteerAvailabilities(
    context: Context,
    userId: number,
    availabilities: Availability[]
  ) {
    return context.$axios.put<HttpStringified<Period[]>>(
      `${this.basePath}/${userId}`,
      availabilities
    );
  }
}
