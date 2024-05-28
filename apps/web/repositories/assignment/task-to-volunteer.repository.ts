import {
  AssignableVolunteers,
  AssignmentIdentifier,
  MissingAssignmentTask,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { HttpStringified } from "@overbookd/http";
import { Context } from "../../utils/api/axios";

export class TaskToVolunteerRepository {
  private static readonly basePath = "assignments/task-to-volunteer";

  static getTasks(context: Context, all: boolean) {
    return context.$axios.get<HttpStringified<MissingAssignmentTask[]>>(
      `${this.basePath}/tasks`,
      { params: { all } },
    );
  }

  static selectTask(context: Context, taskId: number) {
    return context.$axios.get<HttpStringified<TaskWithAssignmentsSummary>>(
      `${this.basePath}/tasks/${taskId}`,
    );
  }

  static getAssignableVolunteersForAssignement(
    context: Context,
    { taskId, mobilizationId, assignmentId }: AssignmentIdentifier,
  ) {
    return context.$axios.get<HttpStringified<AssignableVolunteers[]>>(
      `${this.basePath}/tasks/${taskId}/mobilizations/${mobilizationId}/assignments/${assignmentId}/assignable-volunteers`,
    );
  }
}
