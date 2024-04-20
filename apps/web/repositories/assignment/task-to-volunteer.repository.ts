import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  AssignableVolunteers,
  MissingAssignmentTask,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { HttpStringified } from "@overbookd/http";

export type Context = { $axios: NuxtAxiosInstance };

export class TaskToVolunteerRepository {
  private static readonly basePath = "assignments/task-to-volunteer";

  static getTasks(context: Context) {
    return context.$axios.get<HttpStringified<MissingAssignmentTask[]>>(
      `${this.basePath}/tasks`,
    );
  }

  static selectTask(context: Context, ftId: number) {
    return context.$axios.get<HttpStringified<TaskWithAssignmentsSummary>>(
      `${this.basePath}/tasks/${ftId}`,
    );
  }

  static getAssignableVolunteersForAssignement(
    context: Context,
    ftId: number,
    mobilizationId: string,
    assignmentId: string,
  ) {
    return context.$axios.get<HttpStringified<AssignableVolunteers[]>>(
      `${this.basePath}tasks/${ftId}/mobilizations/${mobilizationId}/assignments/${assignmentId}/assignableVolunteers`,
    );
  }
}
