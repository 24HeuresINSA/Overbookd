import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { BulkAssignmentRequest } from "~/store/assignment";
import { Volunteer } from "~/utils/models/assignment";
import {
  AvailableTimespan,
  FtTimespanWithRequestedTeams,
  FtWithTimespan,
  TimespanWithAssignees,
} from "~/utils/models/ftTimespan";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

type AssignmentResponse = {
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
    return context.$axios.get<HttpStringified<AvailableTimespan[]>>(
      `${this.basePath}/volunteer/${volunteerId}/ft-timespans`
    );
  }

  static getVolunteersForTimespan(context: Context, timespanId: number) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(
      `${this.basePath}/ft-timespans/${timespanId}/volunteers`
    );
  }

  static assign(context: Context, assignment: BulkAssignmentRequest) {
    return context.$axios.post<HttpStringified<AssignmentResponse>>(
      this.basePath,
      assignment
    );
  }

  static unassign(context: Context, timespanId: number, assigneeId: number) {
    return context.$axios.delete<void>(
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

  static updateAffectedTeam(
    context: Context,
    timespanId: number,
    assigneeId: number,
    team: string
  ) {
    return context.$axios.patch<void>(
      `${this.basePath}/ft-timespans/${timespanId}/assignees/${assigneeId}/affected-team`,
      { team }
    );
  }
}
