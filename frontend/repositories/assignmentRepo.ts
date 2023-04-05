import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Volunteer } from "~/utils/models/assignment";
import {
  FtWithTimespan,
  TimespanWithFt,
  TimespansWithStats,
} from "~/utils/models/ftTimespan";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

export class AssignmentRepository {
  private static readonly basePath = "assignments";

  static async getVolunteers(context: Context) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(
      `${this.basePath}/volunteers`
    );
  }

  static async getFtWithTeamRequests(context: Context) {
    return context.$axios.get<HttpStringified<FtWithTimespan[]>>(
      `${this.basePath}/ft-timespans`
    );
  }

  static async getTimespansWithStats(context: Context, ftId: number) {
    return context.$axios.get<HttpStringified<TimespansWithStats[]>>(
      `${this.basePath}/ft/${ftId}`
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
