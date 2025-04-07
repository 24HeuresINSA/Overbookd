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
import {
  VolunteerWithAssignmentStats,
  DisplayableAssignment,
  TaskForCalendar,
} from "@overbookd/http";
import {
  SELECT_PERIOD_AND_CATEGORY,
  hasPermission,
} from "../../../user/user.query";
import { UserService } from "../../../user/user.service";
import { BE_AFFECTED } from "@overbookd/permission";
import { HAS_AVAILABILITIES } from "./availabilities.query";
import { Period } from "@overbookd/time";
import { SELECT_USER_IDENTIFIER } from "../../../common/query/user.query";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";
import {
  SELECT_CHARISMA_PERIOD,
  SELECT_USER_DATA_FOR_CHARISMA,
} from "../../../common/query/charisma.query";
import { Charisma } from "@overbookd/charisma";
import { SELECT_PERIOD_WITH_ID } from "../../../common/query/period.query";
import { SELECT_CONTACT } from "../../../festival-event/task/common/repository/adherent.query";
import { SELECT_LOCATION } from "../../../festival-event/common/repository/location.query";

export class PrismaAssignments implements AssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOneForCalendar(
    identifier: AssignmentIdentifier,
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
            appointment: { select: SELECT_LOCATION },
            contacts: { select: { contact: { select: SELECT_CONTACT } } },
          },
        },
      },
    });
    return {
      id: assignment.festivalTask.id,
      name: assignment.festivalTask.name,
      status: assignment.festivalTask.status,
      appointment: assignment.festivalTask.appointment,
      contacts: assignment.festivalTask.contacts.map(({ contact }) => ({
        id: contact.id,
        firstname: contact.firstname,
        lastname: contact.lastname,
        phone: contact.phone,
      })),
      globalInstructions: assignment.festivalTask.globalInstruction,
      inChargeInstructions: assignment.festivalTask.inChargeInstruction,
      timeWindow: {
        id: assignment.id,
        start: assignment.start,
        end: assignment.end,
      },
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

  async getVolunteersAssignmentStats(): Promise<
    VolunteerWithAssignmentStats[]
  > {
    const [volunteers, charismaPeriods] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          ...IS_NOT_DELETED,
          ...hasPermission(BE_AFFECTED),
          ...HAS_AVAILABILITIES,
        },
        select: {
          ...SELECT_USER_IDENTIFIER,
          ...SELECT_USER_DATA_FOR_CHARISMA,
          assigned: {
            select: { assignment: { select: SELECT_PERIOD_AND_CATEGORY } },
          },
        },
        orderBy: { id: "asc" },
      }),
      this.prisma.charismaPeriod.findMany({ select: SELECT_CHARISMA_PERIOD }),
    ]);
    return volunteers.map(
      ({
        assigned,
        charismaEventParticipations,
        availabilities,
        ...volunteer
      }) => {
        const stats = UserService.formatAssignmentStats(
          assigned.map(({ assignment }) => assignment),
        );
        const charisma = Charisma.init()
          .addEvents(charismaEventParticipations)
          .addAvailabilities(availabilities, charismaPeriods)
          .calculate();
        return { ...volunteer, charisma, stats };
      },
    );
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
