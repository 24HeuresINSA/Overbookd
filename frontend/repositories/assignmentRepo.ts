import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { AssignmentStats, BulkAssignmentRequest } from "~/store/assignment";
import { UpdateAssignedTeam, Volunteer } from "~/utils/models/assignment";
import {
  AvailableTimeSpan,
  FtTimeSpanWithRequestedTeams,
  FtWithTimeSpan,
  TimeSpanWithAssignees,
} from "~/utils/models/ftTimeSpan";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

type AssignmentResponse = {
  assigneeId: number;
  timeSpanId: number;
  teamRequestId: number;
};

export class AssignmentRepository {
  private static readonly basePath = "assignments";

  static getVolunteers(context: Context) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(
      `${this.basePath}/volunteers`
    );
  }

  static getFtWithTimeSpans(context: Context) {
    return context.$axios.get<HttpStringified<FtWithTimeSpan[]>>(
      `${this.basePath}/ft-timespans`
    );
  }

  static getTimeSpansWithStats(context: Context, ftId: number) {
    return context.$axios.get<HttpStringified<FtTimeSpanWithRequestedTeams[]>>(
      `${this.basePath}/ft/${ftId}`
    );
  }

  static getTimeSpansForVolunteer(context: Context, volunteerId: number) {
    return context.$axios.get<HttpStringified<AvailableTimeSpan[]>>(
      `${this.basePath}/volunteer/${volunteerId}/ft-timespans`
    );
  }

  static getVolunteersForTimeSpan(context: Context, timeSpanId: number) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(
      `${this.basePath}/ft-timespans/${timeSpanId}/volunteers`
    );
  }

  static assign(context: Context, assignment: BulkAssignmentRequest) {
    return context.$axios.post<HttpStringified<AssignmentResponse>>(
      this.basePath,
      assignment
    );
  }

  static unassign(context: Context, timeSpanId: number, assigneeId: number) {
    return context.$axios.delete<void>(
      `${this.basePath}/ft-timespans/${timeSpanId}/volunteers/${assigneeId}`
    );
  }

  static getAvailableFriends(
    context: Context,
    volunteerId: number,
    timeSpanId: number
  ) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(
      `${this.basePath}/ft-timespans/${timeSpanId}/volunteers/${volunteerId}/available-friends`
    );
  }

  static getTimeSpanDetails(context: Context, timeSpanId: number) {
    return context.$axios.get<HttpStringified<TimeSpanWithAssignees>>(
      `${this.basePath}/ft-timespans/${timeSpanId}`
    );
  }

  static updateAssignedTeam(
    context: Context,
    { timeSpanId: timeSpanId, assigneeId, team }: UpdateAssignedTeam
  ) {
    return context.$axios.patch<HttpStringified<AssignmentResponse>>(
      `${this.basePath}/ft-timespans/${timeSpanId}/assignees/${assigneeId}/affected-team`,
      { team }
    );
  }

  static getStats(context: Context) {
    return context.$axios.get<HttpStringified<AssignmentStats[]>>(
      `${this.basePath}/stats`
    );
  }
}
