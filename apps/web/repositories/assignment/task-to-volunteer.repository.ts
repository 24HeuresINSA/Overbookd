import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  AssignableVolunteers,
  MissingAssignmentTask,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { HttpStringified } from "@overbookd/http";
import { ExtendedAssignementIdentifier } from "~/utils/assignment/assignment-identifier";

export type Context = { $axios: NuxtAxiosInstance };

export class TaskToVolunteerRepository {
  private static readonly basePath = "assignments/task-to-volunteer";

  static getTasks(context: Context) {
    return context.$axios.get<HttpStringified<MissingAssignmentTask[]>>(
      `${this.basePath}/tasks`,
    );
  }

  static selectTask(context: Context, taskId: number) {
    return context.$axios.get<HttpStringified<TaskWithAssignmentsSummary>>(
      `${this.basePath}/tasks/${taskId}`,
    );
  }

  static getAssignableVolunteersForAssignement(
    context: Context,
    { taskId, mobilizationId, assignmentId }: ExtendedAssignementIdentifier,
  ) {
    return context.$axios.get<HttpStringified<AssignableVolunteers[]>>(
      `${this.basePath}/tasks/${taskId}/mobilizations/${mobilizationId}/assignments/${assignmentId}/assignable-volunteers`,
    );
  }
}
