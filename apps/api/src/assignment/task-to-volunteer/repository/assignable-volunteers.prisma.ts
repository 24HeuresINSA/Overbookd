import {
  AssignableVolunteers,
  AssignmentIdentifier,
  AssignmentSpecification,
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
  COUNT_FRIENDS,
  hasAtLeastOneFriend,
} from "../../common/repository/friend.query";
import { HAS_AVAILABILITIES } from "../../common/repository/availabilities.query";
import { EXISTS_AND_NOT_READY_TO_ASSIGN } from "../../common/repository/task.query";
import { extendOneOfTeams } from "../../common/extend-teams";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";
import { Charisma } from "@overbookd/charisma";
import {
  MinimalCharismaPeriod,
  SELECT_CHARISMA_PERIOD,
} from "../../../common/query/charisma.query";
import { NO_PREF } from "@overbookd/preference";

export class PrismaAssignableVolunteers implements AssignableVolunteers {
  constructor(private readonly prisma: PrismaService) {}

  async on(
    assignmentIdentifier: AssignmentIdentifier,
    assignmentSpecification: AssignmentSpecification,
  ): Promise<StoredAssignableVolunteer[]> {
    const { oneOfTheTeams, period } = assignmentSpecification;

    const [volunteers, charismaPeriods] = await Promise.all([
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
          ...COUNT_FRIENDS,
        },
      }),
      this.prisma.charismaPeriod.findMany({ select: SELECT_CHARISMA_PERIOD }),
    ]);

    return volunteers.map((volunteer) =>
      toStoredAssignableVolunteer(
        volunteer,
        assignmentIdentifier,
        charismaPeriods,
      ),
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
        },
      },
      friendRequestors: {
        select: { friend: { select: selectFriend } },
        where: {
          OR: [
            { friend: isAssignableOn(oneOfTheTeams, period) },
            { friend: isAssignedOn(assignmentIdentifier) },
          ],
        },
      },
    };
  }
}

function toStoredAssignableVolunteer(
  volunteer: DatabaseStoredAssignableVolunteer,
  { assignmentId, mobilizationId, taskId }: AssignmentIdentifier,
  charismaPeriods: MinimalCharismaPeriod[],
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
    hasAtLeastOneFriend: hasAtLeastOneFriend(volunteer),
    preference: {
      assignment: volunteer.preference?.assignment || NO_PREF,
    },
  };
}

function isAssignableOn(oneOfTheTeams: string[], period: Period) {
  return {
    ...IS_NOT_DELETED,
    ...HAS_AVAILABILITIES,
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
    teams: { some: { teamCode: { in: extendOneOfTeams(oneOfTheTeams) } } },
    availabilities: { some: includePeriodCondition(period) },
  };
}
