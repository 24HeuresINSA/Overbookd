import {
  AssignableVolunteers,
  AssignmentIdentifier,
  AssignmentSpecification,
  extendOneOfTeams,
  StoredAssignableVolunteer,
} from "@overbookd/assignment";
import { IProvidePeriod, Period } from "@overbookd/time";
import { PrismaService } from "../../../prisma.service";
import {
  DatabaseStoredAssignableVolunteer,
  SELECT_VOLUNTEER,
} from "./assignable-volunteer.query";
import {
  SELECT_PERIOD,
  overlapPeriodCondition,
  includePeriodCondition,
} from "../../../common/query/period.query";
import {
  DatabaseFriendCount,
  getFriendCount,
  SELECT_USER_FRIENDS_FOR_COUNT,
} from "../../common/repository/friend.query";
import { EXISTS_AND_NOT_READY_TO_ASSIGN } from "../../common/repository/task.query";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";
import { Charisma } from "@overbookd/charisma";
import {
  MinimalCharismaPeriod,
  SELECT_CHARISMA_PERIOD,
} from "../../../common/query/charisma.query";
import { NO_PREF } from "@overbookd/preference";
import { IS_MEMBER_OF_VOLUNTEER_TEAM } from "../../../common/query/user.query";
import { IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER } from "../../../user/user.query";

export class PrismaAssignableVolunteers implements AssignableVolunteers {
  constructor(private readonly prisma: PrismaService) {}

  async on(
    assignmentIdentifier: AssignmentIdentifier,
    assignmentSpecification: AssignmentSpecification,
  ): Promise<StoredAssignableVolunteer[]> {
    const { oneOfTheTeams, period } = assignmentSpecification;

    const [volunteers, charismaPeriods, volunteerFriends] = await Promise.all([
      this.prisma.user.findMany({
        where: isAssignableOn(oneOfTheTeams, period),
        select: {
          ...SELECT_VOLUNTEER,
          ...this.buildVolunteerAssignmentSelection(),
          ...this.buildFestivalTaskMobilizationSelection(period),
          ...this.buildAssignableFriendSelection(
            assignmentIdentifier,
            assignmentSpecification,
          ),
        },
      }),
      this.prisma.charismaPeriod.findMany({ select: SELECT_CHARISMA_PERIOD }),
      this.prisma.user.findMany({
        where: isAssignableOn(oneOfTheTeams, period),
        select: { id: true, ...SELECT_USER_FRIENDS_FOR_COUNT },
      }),
    ]);

    const volunteerFriendsMap = new Map<number, DatabaseFriendCount>(
      volunteerFriends.map(({ id, ...friends }) => [id, friends]),
    );

    return volunteers.map((volunteer) => {
      const friendsForCount: DatabaseFriendCount = volunteerFriendsMap.get(
        volunteer.id,
      ) ?? {
        friends: [],
        friendRequestors: [],
      };

      return toStoredAssignableVolunteer(
        volunteer,
        assignmentIdentifier,
        charismaPeriods,
        friendsForCount,
      );
    });
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

  private buildVolunteerAssignmentSelection() {
    return {
      assigned: {
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

  private buildAssignableFriendSelection(
    assignmentIdentifier: AssignmentIdentifier,
    { oneOfTheTeams, period }: AssignmentSpecification,
  ) {
    const selectAssignment = {
      assignment: {
        select: {
          festivalTaskId: true,
          mobilizationId: true,
          id: true,
          ...SELECT_PERIOD,
        },
      },
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
        where: {
          OR: [
            { requestor: isAssignableOn(oneOfTheTeams, period) },
            { requestor: isAssignedOn(assignmentIdentifier) },
          ],
          requestor: IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER,
        },
      },
      friendRequestors: {
        select: { friend: { select: selectFriend } },
        where: {
          OR: [
            { friend: isAssignableOn(oneOfTheTeams, period) },
            { friend: isAssignedOn(assignmentIdentifier) },
          ],
          friend: IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER,
        },
      },
    };
  }
}

function toStoredAssignableVolunteer(
  volunteer: DatabaseStoredAssignableVolunteer,
  { assignmentId, mobilizationId, taskId }: AssignmentIdentifier,
  charismaPeriods: MinimalCharismaPeriod[],
  friendsForCount: DatabaseFriendCount,
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

  const assignedFriends = friends.filter((friend) =>
    friend.assigned.some(
      ({ assignment }) =>
        assignment.festivalTaskId === taskId &&
        assignment.mobilizationId === mobilizationId &&
        assignment.id === assignmentId,
    ),
  );

  const assignableFriendsIds = friends
    .filter(({ id }) => {
      const friend = friends.find((friend) => friend.id === id);
      return !assignedFriends.includes(friend);
    })
    .map(({ id }) => id);

  const charisma = Charisma.init()
    .addEvents(volunteer.charismaEventParticipations)
    .addAvailabilities(volunteer.availabilities, charismaPeriods)
    .calculate();
  return {
    id: volunteer.id,
    firstname: volunteer.firstname,
    lastname: volunteer.lastname,
    nickname: volunteer.nickname,
    charisma,
    comment: volunteer.comment,
    note: volunteer.note,
    teams: volunteer.teams.map((team) => team.teamCode),
    assignments,
    requestedDuring,
    assignableFriendsIds: Array.from(new Set(assignableFriendsIds)),
    hasFriendAssigned: assignedFriends.length > 0,
    friendCount: getFriendCount(friendsForCount),
    assignmentPreference: volunteer.preference?.assignment || NO_PREF,
  };
}

function isAssignableOn(oneOfTheTeams: string[], period: Period) {
  return {
    ...IS_NOT_DELETED,
    ...buildHasAvailabilityCondition(oneOfTheTeams, period),
    assigned: { none: { assignment: overlapPeriodCondition(period) } },
    breaks: { none: overlapPeriodCondition(period) },
  };
}

function isAssignedOn({
  assignmentId,
  mobilizationId,
  taskId,
}: AssignmentIdentifier) {
  return {
    assigned: {
      some: {
        assignment: {
          id: assignmentId,
          mobilizationId,
          festivalTaskId: taskId,
        },
      },
    },
  };
}

function buildHasAvailabilityCondition(
  oneOfTheTeams: string[],
  period: IProvidePeriod,
) {
  return {
    AND: [
      IS_MEMBER_OF_VOLUNTEER_TEAM,
      {
        teams: { some: { teamCode: { in: extendOneOfTeams(oneOfTheTeams) } } },
      },
    ],
    availabilities: { some: includePeriodCondition(period) },
  };
}
