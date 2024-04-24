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
import { Category } from "@overbookd/festival-event-constants";
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
import { EXISTS_AND_NOT_READY_TO_ASSIGN } from "../../common/repository/task.query";

export class PrismaAssignableVolunteers implements AssignableVolunteers {
  constructor(private readonly prisma: PrismaService) {}

  async on(
    taskId: number,
    assignmentSpecification: AssignmentSpecification,
  ): Promise<StoredAssignableVolunteer[]> {
    const { oneOfTheTeams, period, category } = assignmentSpecification;

    const volunteers = await this.prisma.user.findMany({
      where: isAssignableOn(oneOfTheTeams, period),
      select: {
        ...SELECT_VOLUNTEER,
        ...this.buildVolunteerAssignmentSelection(category),
        ...this.buildFestivalTaskMobilizationSelection(period),
        ...this.buildAssignableFriendSelection(assignmentSpecification),
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
      ft: EXISTS_AND_NOT_READY_TO_ASSIGN,
    };

    return {
      festivalTaskMobilizations: {
        where: { mobilization: mobilizationIncludedNotYetReadyToAssign },
        select: { mobilization: { select: SELECT_PERIOD } },
      },
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
    const selectAssignment = {
      assignment: { select: { festivalTaskId: true, ...SELECT_PERIOD } },
    };

    const assignmentDuringPeriod = {
      assignment: { start: period.start, end: period.end },
    };

    const selectFriend = {
      id: true,
      assigned: {
        select: selectAssignment,
        where: assignmentDuringPeriod,
      },
    };

    return {
      friends: {
        select: { requestor: { select: selectFriend } },
        where: { requestor: isAssignableOn(oneOfTheTeams, period) },
      },
      friendRequestors: {
        select: { friend: { select: selectFriend } },
        where: { friend: isAssignableOn(oneOfTheTeams, period) },
      },
    };
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

  const assignableFriendsIds = Array.from(new Set(friends.map(({ id }) => id)));

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
    assignableFriendsIds,
    hasFriendAssigned,
    hasAtLeastOneFriend: hasAtLeastOneFriend(volunteer),
  };
}

function isAssignableOn(oneOfTheTeams: string[], period: Period) {
  return {
    ...IS_NOT_DELETED,
    ...HAS_POSITIVE_CHARISMA,
    ...buildHasAvailabilityCondition(oneOfTheTeams, period),
    assigned: { none: { assignment: overlapPeriodCondition(period) } },
  };
}

function extendOneOfTeams(oneOfTeams: string[]): string[] {
  return oneOfTeams.includes(CONFIANCE)
    ? [...oneOfTeams, VIEUX, HARD]
    : oneOfTeams;
}

function buildHasAvailabilityCondition(
  oneOfTheTeams: string[],
  period: IProvidePeriod,
) {
  return {
    teams: { some: { teamCode: { in: extendOneOfTeams(oneOfTheTeams) } } },
    availabilities: { some: includePeriodCondition(period) },
  };
}
