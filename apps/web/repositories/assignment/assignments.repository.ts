import type {
  Assignment,
  AssignmentIdentifier,
  Assignments,
  VolunteersForAssignment,
} from "@overbookd/assignment";
import type {
  DisplayableAssignment,
  HttpStringified,
  VolunteerWithAssignmentStats,
} from "@overbookd/http";
import { isSuccess } from "~/utils/http/api-fetch";
import { HttpClient } from "~/utils/http/http-client";
import { castPeriodWithDate } from "~/utils/http/period";

export class AssignmentsRepository implements Assignments {
  private static readonly basePath = "assignments";

  async assign(
    volunteersForAssignment: VolunteersForAssignment,
  ): Promise<Assignment> {
    const res = await HttpClient.post<Assignment>(
      `${AssignmentsRepository.basePath}`,
      volunteersForAssignment,
    );
    if (!isSuccess(res)) throw res;
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

  static async findOne(
    { taskId, mobilizationId, assignmentId }: AssignmentIdentifier,
    withDetails: boolean = false,
  ) {
    return HttpClient.get<Assignment>({
      path: `${this.basePath}/tasks/${taskId}/mobilizations/${mobilizationId}/assignments/${assignmentId}`,
      params: { withDetails },
    });
  }

  static findAllFor(volunteerId: number) {
    return HttpClient.get<DisplayableAssignment[]>(
      `${this.basePath}/volunteers/${volunteerId}/assignments`,
    );
  }

  static fetchVolunteersWithAssignmentStats() {
    return HttpClient.get<VolunteerWithAssignmentStats[]>(
      `${this.basePath}/stats`,
    );
  }
}

function castWithDate(assignment: HttpStringified<Assignment>): Assignment {
  return { ...assignment, ...castPeriodWithDate(assignment) };
}
