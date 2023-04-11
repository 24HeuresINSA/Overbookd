import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Volunteer } from "~/utils/models/assignment";
import {
  FtTimespanWithRequestedTeams,
  FtWithTimespan,
  TimespanWithAssignees,
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

  static getVolunteers(context: Context) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(
      `${this.basePath}/volunteers`
    );
  }

  static getFtWithTimespans(context: Context) {
    return context.$axios.get<HttpStringified<FtWithTimespan[]>>(
      `${this.basePath}/ft-timespans`
    );
  }

  static getTimespansWithStats(context: Context, ftId: number) {
    return context.$axios.get<HttpStringified<FtTimespanWithRequestedTeams[]>>(
      `${this.basePath}/ft/${ftId}`
    );
  }

  static getTimespansForVolunteer(context: Context, volunteerId: number) {
    return context.$axios.get<HttpStringified<TimespanWithFt[]>>(
      `${this.basePath}/volunteer/${volunteerId}/ft-timespans`
    );
  }

  static getVolunteersForTimespan(context: Context, timespanId: number) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(
      `${this.basePath}/ft-timespans/${timespanId}/volunteers`
    );
  }

  static assign(context: Context, assignment: AssignmentRequest) {
    return context.$axios.post<HttpStringified<AssignmentResponse>>(
      this.basePath,
      assignment
    );
  }

  static unassign(context: Context, timespanId: number, assigneeId: number) {
    return context.$axios.delete<HttpStringified<AssignmentResponse>>(
      `${this.basePath}/ft-timespans/${timespanId}/volunteers/${assigneeId}`
    );
  }

  static getAvailableFriends(
    context: Context,
    volunteerId: number,
    timespanId: number
  ) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(
      `${this.basePath}/ft-timespans/${timespanId}/volunteers/${volunteerId}/available-friends`
    );
  }

  static getTimespanDetails(context: Context, timespanId: number) {
    return context.$axios.get<HttpStringified<TimespanWithAssignees>>(
      `${this.basePath}/ft-timespans/${timespanId}`
    );
  }
}
