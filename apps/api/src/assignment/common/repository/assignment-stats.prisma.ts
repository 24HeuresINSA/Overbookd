import { PrismaService } from "../../../prisma.service";
import { AssignmentStatsRepository } from "../assignment.service";
import {
  VolunteerWithAssignmentStats,
  AssignmentStats,
  AssignmentStat,
} from "@overbookd/http";
import { hasPermission } from "../../../user/user.query";
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
import { getFriendCount, SELECT_USER_FRIENDS_FOR_COUNT } from "./friend.query";
import { Category } from "@overbookd/festival-event-constants";
import {
  DatabaseAssignmentWithTaskCategory,
  DatabaseVolunteerAssignmentStatWithAssignees,
  SELECT_ASSIGNEE_FOR_FRIEND_STATS,
  SELECT_PERIOD_AND_TASK_CATEGORY,
} from "./assignment-stats.query";

export class PrismaAssignmentStats implements AssignmentStatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getForAll(): Promise<VolunteerWithAssignmentStats[]> {
    const [volunteers, charismaPeriods, assignmentStats] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          ...IS_NOT_DELETED,
          ...hasPermission(BE_AFFECTED),
          ...HAS_AVAILABILITIES,
        },
        select: {
          ...SELECT_USER_IDENTIFIER,
          ...SELECT_USER_DATA_FOR_CHARISMA,
          ...SELECT_USER_FRIENDS_FOR_COUNT,
        },
        orderBy: { id: "asc" },
      }),
      this.prisma.charismaPeriod.findMany({
        select: SELECT_CHARISMA_PERIOD,
      }),
      this.prisma.assignment.findMany({
        where: { festivalTask: IS_NOT_DELETED },
        select: {
          ...SELECT_PERIOD_AND_TASK_CATEGORY,
          assignees: {
            select: {
              userId: true,
              ...SELECT_ASSIGNEE_FOR_FRIEND_STATS,
            },
          },
        },
      }),
    ]);

    const assignmentByUser = new Map<number, typeof assignmentStats>();
    for (const assignment of assignmentStats) {
      for (const assignee of assignment.assignees) {
        if (!assignmentByUser.has(assignee.userId)) {
          assignmentByUser.set(assignee.userId, []);
        }
        assignmentByUser.get(assignee.userId).push(assignment);
      }
    }

    return volunteers.map((volunteer) => {
      const assignments = assignmentByUser.get(volunteer.id) ?? [];

      const stats = formatAssignmentStats(assignments);
      const withFriendsAssignmentDuration =
        computeAssignmentWithFriendsDuration(volunteer.id, assignments);

      const friendCount = getFriendCount(volunteer);

      const charisma = Charisma.init()
        .addEvents(volunteer.charismaEventParticipations)
        .addAvailabilities(volunteer.availabilities, charismaPeriods)
        .calculate();

      return {
        ...volunteer,
        charisma,
        stats,
        withFriendsAssignmentDuration,
        friendCount,
      };
    });
  }

  async getForOne(volunteerId: number): Promise<AssignmentStats> {
    const [assignments, friends] = await Promise.all([
      this.prisma.assignment.findMany({
        where: {
          assignees: { some: { userId: volunteerId } },
          festivalTask: IS_NOT_DELETED,
        },
        select: {
          ...SELECT_PERIOD_AND_TASK_CATEGORY,
          assignees: { select: SELECT_ASSIGNEE_FOR_FRIEND_STATS },
        },
      }),
      this.prisma.user.findUnique({
        where: { id: volunteerId },
        select: SELECT_USER_FRIENDS_FOR_COUNT,
      }),
    ]);

    const stats = formatAssignmentStats(assignments);
    const withFriendsAssignmentDuration = computeAssignmentWithFriendsDuration(
      volunteerId,
      assignments,
    );
    const friendCount = getFriendCount(friends);

    return { stats, withFriendsAssignmentDuration, friendCount };
  }
}

function formatAssignmentStats(
  assignments: DatabaseAssignmentWithTaskCategory[],
): AssignmentStat[] {
  const map = new Map<Category, number>();
  for (const assignment of assignments) {
    const category = assignment.festivalTask.category;
    const duration = Period.init(assignment).duration.inMilliseconds;
    map.set(category, (map.get(category) ?? 0) + duration);
  }
  return [...map.entries()].map(([category, duration]) => ({
    category,
    duration,
  }));
}

function computeAssignmentWithFriendsDuration(
  volunteerId: number,
  assignments: DatabaseVolunteerAssignmentStatWithAssignees[],
): number {
  return assignments.reduce((duration, assignment) => {
    const hasFriendsAssigned = assignment.assignees.some((assignee) => {
      const { friends, friendRequestors } = assignee.personalData;
      return (
        friends.some(({ requestorId }) => requestorId === volunteerId) ||
        friendRequestors.some(({ friendId }) => friendId === volunteerId)
      );
    });

    if (!hasFriendsAssigned) return duration;
    return duration + Period.init(assignment).duration.inMilliseconds;
  }, 0);
}
