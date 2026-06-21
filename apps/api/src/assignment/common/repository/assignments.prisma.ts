import {
  TeamMemberForDetails,
  Assignment,
  AssignmentIdentifier,
  BaseAssigneeForDetails,
  VolunteersForAssignment,
  WrongTeam,
  retrieveImplicitTeams,
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
import { TaskForCalendar } from "@overbookd/http";
import { Period } from "@overbookd/time";
import { SELECT_USER_IDENTIFIER } from "../../../common/query/user.query";
import { SELECT_PERIOD_WITH_ID } from "../../../common/query/period.query";
import { SELECT_CONTACT } from "../../../festival-event/task/common/repository/adherent.query";
import { SELECT_LOCATION } from "../../../festival-event/common/repository/location.query";

export class PrismaAssignments implements AssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOneForCalendar(
    identifier: AssignmentIdentifier,
    volunteerId: number,
  ): Promise<TaskForCalendar> {
    const { assignmentId, mobilizationId, taskId } = identifier;
    const assignment = await this.prisma.assignment.findUnique({
      where: {
        id_mobilizationId_festivalTaskId: {
          festivalTaskId: taskId,
          id: assignmentId,
          mobilizationId,
        },
      },
      select: {
        ...SELECT_PERIOD_WITH_ID,
        festivalTask: {
          select: {
            id: true,
            name: true,
            status: true,
            globalInstruction: true,
            inChargeInstruction: true,
            inChargeVolunteers: {
              select: { volunteerId: true },
              where: { volunteerId },
            },
            appointment: { select: SELECT_LOCATION },
            contacts: { select: { contact: { select: SELECT_CONTACT } } },
            assignees: {
              select: {
                personalData: { select: SELECT_USER_IDENTIFIER },
                assignment: true,
              },
            },
          },
        },
      },
    });
    const { start, end, festivalTask } = assignment;
    const {
      id,
      name,
      status,
      appointment,
      contacts,
      assignees,
      globalInstruction,
      inChargeVolunteers,
      inChargeInstruction,
    } = festivalTask;
    const assignmentPeriod = Period.init({ start, end });
    const uniqueAssignees = new Set(
      assignees
        .filter((assignee) =>
          Period.init({
            start: assignee.assignment.start,
            end: assignee.assignment.end,
          }).isOverlapping(assignmentPeriod),
        )
        .map(({ personalData }) => personalData),
    );
    return {
      id,
      name,
      status,
      appointment,
      contacts: contacts.map(({ contact }) => contact),
      assignees: Array.from(uniqueAssignees),
      globalInstruction,
      inChargeInstruction:
        inChargeVolunteers.length > 0 ? inChargeInstruction : null,
      timeWindow: { id: assignment.id, start, end },
    };
  }

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
    for (const { id, as } of volunteers) {
      const volunteerTeamCodes = await this.prisma.userTeam.findMany({
        where: { userId: id },
        select: { teamCode: true },
      });
      const volunteerTeams = volunteerTeamCodes.map(({ teamCode }) => teamCode);
      const withImplicitTeams = retrieveImplicitTeams(volunteerTeams);
      const memberOfTeam = withImplicitTeams.includes(as);
      if (!memberOfTeam) throw new WrongTeam(id, as);
    }
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
}

function toAssignment(
  assignment: DatabaseAssignment,
  identifier: AssignmentIdentifier,
): Assignment {
  const demands = assignment.mobilization.teams.map(({ teamCode, count }) => ({
    team: teamCode,
    demand: count,
  }));
  const assignees = assignment.assignees.map(({ teamCode, personalData }) => {
    const as = teamCode ? { as: teamCode } : {};
    return { id: personalData.id, ...as };
  });
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
    firstName: assignee.personalData.firstName,
    lastName: assignee.personalData.lastName,
    comment: assignee.personalData.comment,
    note: assignee.personalData.note,
  };
  if (!assignee.teamCode) return baseAssignee;

  const assignedIds = new Set(
    assignees.map(({ personalData }) => personalData.id),
  );
  const allFriendsAssigned = [
    ...assignee.personalData.friendRequestors.map(({ friend }) => friend),
    ...assignee.personalData.friends.map(({ requestor }) => requestor),
  ].filter(({ id }) => assignedIds.has(id));

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

  const assignmentDuration = assignee.personalData.assigned.reduce(
    (duration, { assignment }) =>
      duration + Period.init(assignment).duration.inMilliseconds,
    0,
  );

  return {
    ...baseAssignee,
    teams,
    as: assignee.teamCode,
    friends,
    assignmentDuration,
  };
}
