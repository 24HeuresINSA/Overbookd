import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Availability } from "~/domain/volunteer-availability/volunteer-availability";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

export class VolunteerAvailabilityRepository {
  private static readonly basePath = "volunteer-availability";

  static async getVolunteerAvailabilities(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<Availability[]>>(
      `${this.basePath}/${userId}`
    );
  }

  static async updateVolunteerAvailability(
    context: Context,
    userId: number,
    availabilities: Availability[]
  ) {
    return context.$axios.put<HttpStringified<Availability[]>>(
      `${this.basePath}/${userId}`,
      availabilities
    );
  }
}
