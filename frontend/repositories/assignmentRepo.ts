import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Volunteer } from "~/utils/models/assignment";
import { FtWithTimespan, TimespanWithFt } from "~/utils/models/ftTimespan";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

export class AssignmentRepository {
  private static readonly basePath = "assignments";

  static async getVolunteers(context: Context) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(
      `${this.basePath}/volunteers`
    );
  }

  static async getFtWithTimespans(context: Context) {
    return context.$axios.get<HttpStringified<FtWithTimespan[]>>(
      `${this.basePath}/ft-timespans`
    );
  }

  static async getTimespansForVolunteer(context: Context, volunteerId: number) {
    return context.$axios.get<HttpStringified<TimespanWithFt[]>>(
      `${this.basePath}/volunteer/${volunteerId}/ft-timespans`
    );
  }

  static async getVolunteersForTimespan(context: Context, timespanId: number) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(
      `${this.basePath}/ft-timespan/${timespanId}/volunteers`
    );
  }
}
