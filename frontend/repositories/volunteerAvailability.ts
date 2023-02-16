import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { VolunteerAvailability } from "~/utils/models/volunteerAvailability";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

export class VolunteerAvailabilityRepository {
  private static readonly basePath = "volunteer-availability";

  static async getVolunteerAvailabilities(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<VolunteerAvailability[]>>(
      `${this.basePath}/${userId}`
    );
  }

  static async updateVolunteerAvailability(
    context: Context,
    userId: number,
    volunteerAvailabilities: VolunteerAvailability[]
  ) {
    return context.$axios.put<HttpStringified<VolunteerAvailability[]>>(
      `${this.basePath}/${userId}`,
      volunteerAvailabilities
    );
  }
}
