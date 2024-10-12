import type {
  AssignableVolunteer,
  AssignmentIdentifier,
  MissingAssignmentTask,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { HttpClient } from "~/utils/http/http-client";

export class TaskToVolunteerRepository {
  private static readonly basePath = "assignments/task-to-volunteer";

  static getTasks(all: boolean) {
    return HttpClient.get<MissingAssignmentTask[]>({
      path: `${this.basePath}/tasks`,
      params: { all },
    });
  }

  static selectTask(taskId: number) {
    return HttpClient.get<TaskWithAssignmentsSummary>(
      `${this.basePath}/tasks/${taskId}`,
    );
  }

  static getAssignableVolunteersForAssignement({
    taskId,
    mobilizationId,
    assignmentId,
  }: AssignmentIdentifier) {
    return HttpClient.get<AssignableVolunteer[]>(
      `${this.basePath}/tasks/${taskId}/mobilizations/${mobilizationId}/assignments/${assignmentId}/assignable-volunteers`,
    );
  }
}
