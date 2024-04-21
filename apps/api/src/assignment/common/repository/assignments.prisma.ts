import {
  Assignment,
  AssignmentIdentifier,
  VolunteersForAssignment,
} from "@overbookd/assignment";
import { AssignmentRepository } from "../assignment.service";
import { PrismaService } from "../../../prisma.service";
import { DatabaseAssignment, SELECT_ASSIGNMENT } from "./assignment.query";

export class PrismaAssignments implements AssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(identifier: AssignmentIdentifier): Promise<Assignment> {
    const { assignmentId, mobilizationId, taskId } = identifier;
    const assignment = await this.prisma.assignment.findUnique({
      where: {
        id_mobilizationId_festivalTaskId: {
          festivalTaskId: taskId,
          id: assignmentId,
          mobilizationId,
        },
      },
      select: SELECT_ASSIGNMENT,
    });

    return toAssignment(assignment, identifier);
  }

  async assign({
    assignment,
    volunteers,
  }: VolunteersForAssignment): Promise<Assignment> {
    console.log(assignment, volunteers);
    throw new Error("Method not implemented.");
  }
}

function toAssignment(
  assignment: DatabaseAssignment,
  identifier: AssignmentIdentifier,
): Assignment {
  const demands = assignment.mobilization.teams.map(({ teamCode, count }) => ({
    team: teamCode,
    demand: count,
  }));
  const assignees = assignment.assignees.map(({ userId, teamCode }) => ({
    id: userId,
    as: teamCode,
  }));
  return {
    ...identifier,
    start: assignment.start,
    end: assignment.end,
    name: assignment.festivalTask.name,
    demands,
    assignees,
  };
}
