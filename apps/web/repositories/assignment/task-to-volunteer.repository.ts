import type {
  AssignableVolunteer,
  AssignmentIdentifier,
  TaskForAssignment,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { HttpClient } from "~/utils/http/http-client";

export class TaskToVolunteerRepository {
  private static readonly basePath = "assignments/task-to-volunteer";

  static getAssignableTasks() {
    return HttpClient.get<TaskForAssignment[]>({
      path: `${this.basePath}/assignableTasks`,
    });
  }

  static getAllTasks() {
    return HttpClient.get<TaskForAssignment[]>({
      path: `${this.basePath}/allTasks`,
    });
  }

  static selectTask(taskId: number) {
    return HttpClient.get<TaskWithAssignmentsSummary>(
      `${this.basePath}/tasks/${taskId}`,
    );
  }

  static getAssignableVolunteersForAssignment({
    taskId,
    mobilizationId,
    assignmentId,
  }: AssignmentIdentifier) {
    return HttpClient.get<AssignableVolunteer[]>(
      `${this.basePath}/tasks/${taskId}/mobilizations/${mobilizationId}/assignments/${assignmentId}/assignable-volunteers`,
    );
  }
}
