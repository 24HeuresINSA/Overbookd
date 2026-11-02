import type {
  Assignment,
  AssignmentIdentifier,
  Assignments,
  VolunteersForAssignment,
} from "@overbookd/assignment";
import type {
  AssignmentStats,
  HttpStringified,
  TaskForCalendar,
  VolunteerWithAssignmentStats,
} from "@overbookd/http";
import { isHttpError } from "~/utils/http/http-error.utils";
import { HttpClient } from "~/utils/http/http-client";
import { castPeriodWithDate } from "~/utils/http/cast-date/period.utils";

export class AssignmentsRepository implements Assignments {
  private static readonly basePath = "assignments";

  async assign(
    volunteersForAssignment: VolunteersForAssignment,
  ): Promise<Assignment> {
    const res = await HttpClient.post<Assignment>(
      `${AssignmentsRepository.basePath}`,
      volunteersForAssignment,
    );
    if (isHttpError(res)) throw res;
    return castWithDate(res);
  }

  async unassign(
    assignment: AssignmentIdentifier,
    assigneeId: number,
  ): Promise<void> {
    await HttpClient.delete(
      `${AssignmentsRepository.basePath}/tasks/${assignment.taskId}/mobilizations/${assignment.mobilizationId}/assignments/${assignment.assignmentId}/assignees/${assigneeId}`,
    );
  }

  static async findOne<T extends Assignment>(
    { taskId, mobilizationId, assignmentId }: AssignmentIdentifier,
    withDetails: boolean = false,
  ) {
    return HttpClient.get<T>({
      path: `${this.basePath}/tasks/${taskId}/mobilizations/${mobilizationId}/assignments/${assignmentId}`,
      params: { withDetails },
    });
  }

  static async findOneForCalendar({
    taskId,
    mobilizationId,
    assignmentId,
  }: AssignmentIdentifier) {
    return HttpClient.get<TaskForCalendar>(
      `${this.basePath}/tasks/${taskId}/mobilizations/${mobilizationId}/assignments/${assignmentId}/for-calendar`,
    );
  }

  static fetchAllVolunteersWithAssignmentStats() {
    return HttpClient.get<VolunteerWithAssignmentStats[]>(
      `${this.basePath}/stats`,
    );
  }

  static fetchOneVolunteerAssignmentStats(userId: number) {
    return HttpClient.get<AssignmentStats>(`${this.basePath}/stats/${userId}`);
  }
}

function castWithDate(assignment: HttpStringified<Assignment>): Assignment {
  return { ...assignment, ...castPeriodWithDate(assignment) };
}
