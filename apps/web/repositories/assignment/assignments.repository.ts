import {
  Assignment,
  AssignmentIdentifier,
  Assignments,
  VolunteersForAssignment,
} from "@overbookd/assignment";
import { Context } from "../context";
import { HttpStringified } from "@overbookd/http";

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
}

function castWithDate(assignment: HttpStringified<Assignment>): Assignment {
  return {
    ...assignment,
    start: new Date(assignment.start),
    end: new Date(assignment.end),
  };
}
