import {
  Assignment,
  AssignmentIdentifier,
  Assignments,
  VolunteersForAssignment,
} from "@overbookd/assignment";
import { Context } from "../../utils/api/axios";
import {
  DisplayableAssignment,
  HttpStringified,
  VolunteerWithAssignmentStats,
} from "@overbookd/http";

export class AssignmentsRepository implements Assignments {
  private static readonly basePath = "assignments";

  constructor(private readonly context: Context) {}

  async assign(
    volunteersForAssignment: VolunteersForAssignment,
  ): Promise<Assignment> {
    const res = await this.context.$axios.post<HttpStringified<Assignment>>(
      `${AssignmentsRepository.basePath}`,
      volunteersForAssignment,
    );
    return castWithDate(res.data);
  }

  async unassign(
    assignment: AssignmentIdentifier,
    assigneeId: number,
  ): Promise<void> {
    await this.context.$axios.delete(
      `${AssignmentsRepository.basePath}/tasks/${assignment.taskId}/mobilizations/${assignment.mobilizationId}/assignments/${assignment.assignmentId}/assignees/${assigneeId}`,
    );
  }

  static async findOne(
    context: Context,
    { taskId, mobilizationId, assignmentId }: AssignmentIdentifier,
    withDetails: boolean = false,
  ) {
    return context.$axios.get<HttpStringified<Assignment>>(
      `${this.basePath}/tasks/${taskId}/mobilizations/${mobilizationId}/assignments/${assignmentId}`,
      { params: { withDetails } },
    );
  }

  static findAllFor(context: Context, volunteerId: number) {
    return context.$axios.get<HttpStringified<DisplayableAssignment[]>>(
      `${this.basePath}/volunteers/${volunteerId}/assignments`,
    );
  }

  static fetchVolunteersWithAssignmentStats(context: Context) {
    return context.$axios.get<HttpStringified<VolunteerWithAssignmentStats[]>>(
      `${this.basePath}/stats`,
    );
  }
}

function castWithDate(assignment: HttpStringified<Assignment>): Assignment {
  return {
    ...assignment,
    start: new Date(assignment.start),
    end: new Date(assignment.end),
  };
}
