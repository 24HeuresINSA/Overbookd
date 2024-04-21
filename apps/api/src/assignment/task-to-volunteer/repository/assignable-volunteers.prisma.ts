import {
  AssignableVolunteers,
  AssignmentSpecification,
  CONFIANCE,
  HARD,
  StoredAssignableVolunteer,
  VIEUX,
} from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import {
  SELECT_VOLUNTEER,
  DatabaseStoredAssignableVolunteer,
} from "./assignable-volunteer.query";
import { IProvidePeriod, Period } from "@overbookd/period";
import { Category, READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import {
  SELECT_PERIOD,
  overlapPeriodCondition,
  includePeriodCondition,
} from "../../common/repository/period.query";
import {
  COUNT_FRIENDS,
  hasAtLeastOneFriend,
} from "../../common/repository/friend.query";
import {
  HAS_POSITIVE_CHARISMA,
  IS_NOT_DELETED,
} from "../../common/repository/common.query";

export class PrismaAssignableVolunteers implements AssignableVolunteers {
  constructor(private readonly prisma: PrismaService) {}

  async on(
    taskId: number,
    assignmentSpecification: AssignmentSpecification,
  ): Promise<StoredAssignableVolunteer[]> {
    const { oneOfTheTeams, period, category } = assignmentSpecification;
    const extendedOneOfTeams = this.extendOneOfTeams(oneOfTheTeams);
    const includePeriod = overlapPeriodCondition(period);

    const volunteers = await this.prisma.user.findMany({
      where: {
        ...IS_NOT_DELETED,
        ...HAS_POSITIVE_CHARISMA,
        ...this.buildHasAvailabilityCondition(extendedOneOfTeams, period),
        assigned: { none: { assignment: includePeriod } },
      },
      select: {
        ...SELECT_VOLUNTEER,
        ...this.buildVolunteerAssignmentSelection(category),
        ...this.buildFestivalTaskMobilizationSelection(period),
        ...this.buildAssignableFriendSelection({
          ...assignmentSpecification,
          oneOfTheTeams: extendedOneOfTeams,
        }),
        ...COUNT_FRIENDS,
      },
    });

    return volunteers.map((volunteer) =>
      toStoredAssignableVolunteer(volunteer, taskId),
    );
  }

  private buildFestivalTaskMobilizationSelection(period: Period) {
    const mobilizationIncludedNotYetReadyToAssign = {
      ...includePeriodCondition(period),
      ft: { status: { not: READY_TO_ASSIGN }, isDeleted: false },
    } as const;

    return {
      festivalTaskMobilizations: {
        where: { mobilization: mobilizationIncludedNotYetReadyToAssign },
        select: { mobilization: { select: SELECT_PERIOD } },
      },
    };
  }

  private buildHasAvailabilityCondition(
    oneOfTheTeams: string[],
    period: IProvidePeriod,
  ) {
    return {
      teams: { some: { teamCode: { in: oneOfTheTeams } } },
      availabilities: { some: includePeriodCondition(period) },
    };
  }

  private buildVolunteerAssignmentSelection(category?: Category) {
    return {
      assigned: {
        where: { assignment: { festivalTask: { category } } },
        select: {
          assignment: {
            select: {
              ...SELECT_PERIOD,
              festivalTask: { select: { category: true } },
            },
          },
        },
      },
    };
  }

  private buildAssignableFriendSelection({
    oneOfTheTeams,
    period,
  }: AssignmentSpecification) {
    const hasAvailability = this.buildHasAvailabilityCondition(
      oneOfTheTeams,
      period,
    );

    const selectAssignment = {
      assignment: { select: { festivalTaskId: true, ...SELECT_PERIOD } },
    };

    const assignmentDuringPeriod = {
      assignment: { start: period.start, end: period.end },
    };

    const friendSelection = {
      availabilities: {
        select: SELECT_PERIOD,
        where: includePeriodCondition(period),
      },
      assigned: {
        select: selectAssignment,
        where: assignmentDuringPeriod,
      },
    };

    return {
      friends: {
        where: { requestor: hasAvailability },
        select: { requestor: { select: friendSelection } },
      },
      friendRequestors: {
        where: { friend: hasAvailability },
        select: { friend: { select: friendSelection } },
      },
    };
  }

  private extendOneOfTeams(oneOfTeams: string[]): string[] {
    return oneOfTeams.includes(CONFIANCE)
      ? [...oneOfTeams, VIEUX, HARD]
      : oneOfTeams;
  }
}

function toStoredAssignableVolunteer(
  volunteer: DatabaseStoredAssignableVolunteer,
  taskId: number,
): StoredAssignableVolunteer {
  const assignments = volunteer.assigned.flatMap(({ assignment }) => ({
    start: assignment.start,
    end: assignment.end,
    category: assignment.festivalTask.category,
  }));

  const requestedDuring = volunteer.festivalTaskMobilizations.map(
    ({ mobilization }) => Period.init(mobilization),
  );

  const friends = [
    ...volunteer.friends.map(({ requestor }) => requestor),
    ...volunteer.friendRequestors.map(({ friend }) => friend),
  ];
  const hasFriendAvailable = friends.some(
    (friend) =>
      friend.availabilities.length > 0 && friend.assigned.length === 0,
  );
  const hasFriendAssigned = friends.some((friend) =>
    friend.assigned.some(
      ({ assignment }) => assignment.festivalTaskId === taskId,
    ),
  );

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
    hasFriendAssigned,
    hasAtLeastOneFriend: hasAtLeastOneFriend(volunteer),
  };
}
