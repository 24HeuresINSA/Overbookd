import {
  AssignmentIdentifier,
  AssignmentIdentifierWithTeam,
  retrieveImplicitTeams,
  TeamAssignments,
} from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import {
  DatabaseAssignmentIdentifier,
  SELECT_ASSIGNMENT_IDENTIFIER,
  uniqueAssignment,
  updateAssigneeOnAssignmentWithTeam,
} from "./assignment.query";
import { Volunteer } from "@overbookd/festival-event";
import { ALL_TEAM_MEMBERS } from "@overbookd/festival-event-constants";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";
import { SELECT_TEAM_CODES } from "../../../common/query/user.query";

type DatabaseAssignmentForTeamAssignment = DatabaseAssignmentIdentifier & {
  mobilization: { teams: { teamCode: string }[] };
};

export class PrismaTeamAssignments implements TeamAssignments {
  constructor(private readonly prisma: PrismaService) {}

  async findTeamAssignmentsToAddForVolunteer(
    volunteerId: Volunteer["id"],
  ): Promise<AssignmentIdentifierWithTeam[]> {
    const volunteer = await this.prisma.user.findUnique({
      where: { id: volunteerId, ...IS_NOT_DELETED },
      select: SELECT_TEAM_CODES,
    });

    const extendedTeams = retrieveImplicitTeams(
      volunteer.teams.map(({ teamCode }) => teamCode),
    );

    const teamsCondition = {
      teamCode: { in: extendedTeams },
      count: ALL_TEAM_MEMBERS,
    };
    const assignments = await this.prisma.assignment.findMany({
      where: {
        mobilization: { teams: { some: teamsCondition } },
        assignees: { none: { userId: volunteerId } },
      },
      select: {
        ...SELECT_ASSIGNMENT_IDENTIFIER,
        mobilization: {
          select: {
            teams: { where: teamsCondition, select: { teamCode: true } },
          },
        },
      },
    });

    return assignments.map(toAssignmentIdentifierWithTeam);
  }

  async findTeamAssignmentsToRemoveForVolunteer(
    volunteerId: Volunteer["id"],
  ): Promise<AssignmentIdentifier[]> {
    const volunteer = await this.prisma.user.findUnique({
      where: { id: volunteerId, ...IS_NOT_DELETED },
      select: SELECT_TEAM_CODES,
    });

    const extendedTeams = retrieveImplicitTeams(
      volunteer.teams.map(({ teamCode }) => teamCode),
    );

    const assignments = await this.prisma.assignment.findMany({
      where: {
        assignees: {
          some: {
            userId: volunteerId,
            teamCode: { not: null, notIn: extendedTeams },
          },
        },
      },
      select: SELECT_ASSIGNMENT_IDENTIFIER,
    });

    return assignments.map(toAssignmentIdentifier);
  }

  async assign(
    assignments: AssignmentIdentifierWithTeam[],
    volunteerId: Volunteer["id"],
  ): Promise<void> {
    await this.prisma.$transaction(
      assignments.map((assignment) => {
        const upsert = updateAssigneeOnAssignmentWithTeam(
          volunteerId,
          assignment,
        );
        return this.prisma.assignment.update({
          where: uniqueAssignment(assignment),
          data: { assignees: { upsert } },
        });
      }),
    );
  }

  async unassign(
    assignments: AssignmentIdentifier[],
    assigneeId: number,
  ): Promise<void> {
    await this.prisma.$transaction(
      assignments.map(({ assignmentId, mobilizationId, taskId }) =>
        this.prisma.assignee.delete({
          where: {
            userId_assignmentId_mobilizationId_festivalTaskId: {
              assignmentId,
              mobilizationId,
              festivalTaskId: taskId,
              userId: assigneeId,
            },
          },
        }),
      ),
    );
  }
}

function toAssignmentIdentifierWithTeam({
  id,
  mobilizationId,
  festivalTaskId,
  mobilization,
}: DatabaseAssignmentForTeamAssignment): AssignmentIdentifierWithTeam {
  const team = mobilization.teams.at(0).teamCode;
  return {
    assignmentId: id,
    mobilizationId,
    taskId: festivalTaskId,
    as: team,
  };
}

function toAssignmentIdentifier({
  id,
  mobilizationId,
  festivalTaskId,
}: DatabaseAssignmentIdentifier): AssignmentIdentifier {
  return {
    assignmentId: id,
    mobilizationId,
    taskId: festivalTaskId,
  };
}
