import {
  TeamMemberForDetails,
  Assignment,
  AssignmentIdentifier,
  BaseAssigneeForDetails,
  VolunteersForAssignment,
} from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import { AssignmentRepository } from "../assignment.service";
import {
  DatabaseAssignee,
  DatabaseAssignment,
  SELECT_ASSIGNMENT,
  uniqueAssignment,
  updateAssigneesOnAssignment,
} from "./assignment.query";

export class PrismaAssignments implements AssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne<T extends boolean>(
    identifier: AssignmentIdentifier,
    withDetails: T,
  ): Promise<Assignment<{ withDetails: T }>> {
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

    if (!withDetails) {
      type Output = Assignment<{ withDetails: T }>;
      return toAssignment(assignment, identifier) as Output;
    }

    return toAssignmentWithDetails(assignment, identifier);
  }

  async assign({
    assignment: identifier,
    volunteers,
  }: VolunteersForAssignment): Promise<Assignment> {
    const upsert = updateAssigneesOnAssignment(volunteers, identifier);
    const assignment = await this.prisma.assignment.update({
      where: uniqueAssignment(identifier),
      data: { assignees: { upsert } },
      select: SELECT_ASSIGNMENT,
    });

    return toAssignment(assignment, identifier);
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
  const assignees = assignment.assignees.map(({ teamCode, personalData }) => ({
    id: personalData.id,
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

function toAssignmentWithDetails(
  assignment: DatabaseAssignment,
  identifier: AssignmentIdentifier,
): Assignment<{ withDetails: true }> {
  const demands = assignment.mobilization.teams.map(({ teamCode, count }) => ({
    team: teamCode,
    demand: count,
  }));
  const assignees = assignment.assignees.map(toAssigneeForDetails);
  return {
    ...identifier,
    start: assignment.start,
    end: assignment.end,
    name: assignment.festivalTask.name,
    appointment: assignment.festivalTask.appointment.name,
    demands,
    assignees,
  };
}

function toAssigneeForDetails(
  assignee: DatabaseAssignee,
): BaseAssigneeForDetails | TeamMemberForDetails {
  const baseAssignee = {
    id: assignee.personalData.id,
    firstname: assignee.personalData.firstname,
    lastname: assignee.personalData.lastname,
  };
  if (!assignee.teamCode) return baseAssignee;

  const teams = assignee.personalData.teams.map(({ teamCode }) => teamCode);
  return {
    ...baseAssignee,
    teams,
    as: assignee.teamCode,
    friends: [], // TODO: implement assigned friends
  };
}
