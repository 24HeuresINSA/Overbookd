import {
  AssignableVolunteers,
  AssignmentSpecification,
  MobilizationIdentifier,
} from "@overbookd/assignment";
import { StoredAssignableVolunteer } from "@overbookd/assignment/src/assign-task-to-volunteer/assignable-volunteer";
import { PrismaService } from "../../../prisma.service";
import {
  SELECT_VOLUNTEER,
  SELECT_VOLUNTEER_MOBILIZATIONS,
  DatabaseStoredAssignableVolunteer,
} from "./assignable-volunteer.query";
import { IProvidePeriod, Period } from "@overbookd/period";
import { Category } from "@overbookd/festival-event-constants";

export class PrismaAssignableVolunteers implements AssignableVolunteers {
  constructor(private readonly prisma: PrismaService) {}

  async on(
    { mobilizationId, taskId }: MobilizationIdentifier,
    { oneOfTheTeams, period, category }: AssignmentSpecification,
  ): Promise<StoredAssignableVolunteer[]> {
    const volunteers = await this.prisma.user.findMany({
      where: {
        isDeleted: false,
        charisma: { lt: 0 },
        ...this.buildAssignableCondition(oneOfTheTeams, period),
      },
      select: {
        ...SELECT_VOLUNTEER,
        ...this.buildVolunteerAssignmentSelection(category),
        ...SELECT_VOLUNTEER_MOBILIZATIONS,
        ...this.buildAssignableFriendCount(oneOfTheTeams, period),
      },
    });

    return volunteers.map(toStoredAssignableVolunteer);
  }

  private buildAssignableCondition(
    oneOfTheTeams: string[],
    period: IProvidePeriod,
  ) {
    return {
      teams: { some: { teamCode: { in: oneOfTheTeams } } },
      availabilities: {
        some: {
          AND: {
            start: { lte: period.end },
            end: { gte: period.start },
          },
        },
      },
    };
  }

  private buildVolunteerAssignmentSelection(category?: Category) {
    return {
      assigned: {
        where: {
          assignment: { festivalTask: { category } },
        },
        select: {
          assignment: {
            select: {
              start: true,
              end: true,
              festivalTask: { select: { category: true } },
            },
          },
        },
      },
    };
  }

  private buildAssignableFriendCount(
    oneOfTheTeams: string[],
    period: IProvidePeriod,
  ) {
    const isAssignable = this.buildAssignableCondition(oneOfTheTeams, period);
    return {
      _count: {
        select: {
          friends: {
            where: { friend: isAssignable },
          },
          friendRequestors: {
            where: { friend: isAssignable },
          },
        },
      },
    };
  }
}

function toStoredAssignableVolunteer(
  volunteer: DatabaseStoredAssignableVolunteer,
): StoredAssignableVolunteer {
  const assignments = volunteer.assigned.flatMap(({ assignment }) => ({
    start: assignment.start,
    end: assignment.end,
    category: assignment.festivalTask.category,
  }));
  const requestedDuring = volunteer.festivalTaskMobilizations.map(
    ({ mobilization }) => Period.init(mobilization),
  );
  const hasFriendAvailable =
    volunteer._count.friends > 0 || volunteer._count.friendRequestors > 0;

  return {
    id: volunteer.id,
    firstname: volunteer.firstname,
    lastname: volunteer.lastname,
    nickname: volunteer.nickname,
    charisma: volunteer.charisma,
    comment: volunteer.comment,
    note: volunteer.note,
    teams: volunteer.teams.map((team) => team.teamCode),
    assignments,
    requestedDuring,
    hasFriendAvailable,
    hasFriendAssigned: false, // TODO
  };
}
