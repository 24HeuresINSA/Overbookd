import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Volunteer } from "~/utils/models/assignment";
import {
  FtTimespanWithRequestedTeams,
  FtWithTimespan,
  TimespanWithFt,
} from "~/utils/models/ftTimespan";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

type AssignmentRequest = {
  timespanId: number;
  teamCode: string;
  volunteerId: number;
};

type AssignmentResponse = {
  id: number;
  assigneeId: number;
  timespanId: number;
  teamRequestId: number;
};

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

  static async getTimespansWithStats(context: Context, ftId: number) {
    return context.$axios.get<HttpStringified<FtTimespanWithRequestedTeams[]>>(
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

  static assign(context: Context, assignment: AssignmentRequest) {
    return context.$axios.post<HttpStringified<AssignmentResponse>>(
      this.basePath,
      assignment
    );
  }
}
