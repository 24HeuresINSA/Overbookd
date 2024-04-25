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
import { MISSING_ITEM_INDEX } from "@overbookd/list";
import { AssignmentStats, DisplayableAssignment } from "@overbookd/http";
import { SELECT_PERIOD_AND_CATEGORY } from "../../../user/user.query";
import { UserService } from "../../../user/user.service";

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

  async findAllFor(volunteerId: number): Promise<DisplayableAssignment[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        assignees: { some: { userId: volunteerId } },
      },
      select: SELECT_ASSIGNMENT,
    });

    return assignments.map((assignment) => ({
      taskId: assignment.festivalTask.id,
      mobilizationId: assignment.mobilization.id,
      assignmentId: assignment.id,
      start: assignment.start,
      end: assignment.end,
      name: assignment.festivalTask.name,
    }));
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

  async unassign(
    assignment: AssignmentIdentifier,
    assigneeId: number,
  ): Promise<void> {
    await this.prisma.assignee.delete({
      where: {
        userId_assignmentId_mobilizationId_festivalTaskId: {
          assignmentId: assignment.assignmentId,
          mobilizationId: assignment.mobilizationId,
          festivalTaskId: assignment.taskId,
          userId: assigneeId,
        },
      },
    });
  }

  async getVolunteersAssignmentStats(): Promise<AssignmentStats[]> {
    const volunteers = await this.prisma.user.findMany({
      where: { isDeleted: false, teams: { none: { team: { code: "hard" } } } },
      select: {
        firstname: true,
        lastname: true,
        assigned: {
          select: { assignment: { select: SELECT_PERIOD_AND_CATEGORY } },
        },
      },
    });
    return volunteers.map(({ assigned, ...volunteer }) => {
      const stats = UserService.formatAssignmentStats(
        assigned.reduce(
          (assignments, { assignment }) => [...assignments, assignment],
          [],
        ),
      );
      return { ...volunteer, stats };
    });
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
  const assignees = assignment.assignees.map((assignee, _, assignees) =>
    toAssigneeForDetails(assignee, assignees),
  );
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
  assignees: DatabaseAssignee[],
): BaseAssigneeForDetails | TeamMemberForDetails {
  const baseAssignee = {
    id: assignee.personalData.id,
    firstname: assignee.personalData.firstname,
    lastname: assignee.personalData.lastname,
    comment: assignee.personalData.comment,
    note: assignee.personalData.note,
  };
  if (!assignee.teamCode) return baseAssignee;

  const allFriendsAssigned = [
    ...assignee.personalData.friendRequestors.map(({ friend }) => friend),
    ...assignee.personalData.friends.map(({ requestor }) => requestor),
  ].filter(({ id }) =>
    assignees.some(({ personalData }) => personalData.id === id),
  );

  const friends = allFriendsAssigned.reduce(
    (friends: BaseAssigneeForDetails[], friend) => {
      const friendIndex = friends.findIndex(({ id }) => friend.id === id);
      const isAlredyListed = friendIndex !== MISSING_ITEM_INDEX;
      if (isAlredyListed) return friends;

      return [...friends, friend];
    },
    [],
  );

  const teams = assignee.personalData.teams.map(({ teamCode }) => teamCode);
  return {
    ...baseAssignee,
    teams,
    as: assignee.teamCode,
    friends,
  };
}
