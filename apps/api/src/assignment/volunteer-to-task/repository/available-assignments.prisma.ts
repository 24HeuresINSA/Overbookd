import { AssignmentSummaryWithTask } from "@overbookd/http";
import { AvailableAssignments } from "../volunteer-to-task.service";
import { PrismaService } from "../../../prisma.service";
import { SELECT_PERIOD } from "../../../common/query/period.query";
import { IProvidePeriod, Period } from "@overbookd/time";
import { Category, Status } from "@overbookd/festival-event-constants";
import {
  countAssigneesInTeam,
  retrieveImplicitTeams,
} from "@overbookd/assignment";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";
import { SELECT_TEAMS_CODE } from "../../../common/query/user.query";
import { friendAssigneesCount } from "../../common/repository/assignment.query";

type DatabaseAssignmentSummaryWithTask = IProvidePeriod & {
  id: string;
  mobilizationId: string;
  festivalTask: {
    id: number;
    name: string;
    category: Category;
    status: Status;
    topPriority: boolean;
    teamCode: string;
  };
  mobilization: { teams: { teamCode: string; count: number }[] };
  assignees: { userId: number; as: { teamCode: string } }[];
  _count: { assignees: number };
};

export class PrismaAvailableAssignments implements AvailableAssignments {
  constructor(private readonly prisma: PrismaService) {}

  async findAssignableFor(
    volunteerId: number,
  ): Promise<AssignmentSummaryWithTask[]> {
    const volunteer = await this.prisma.user.findUnique({
      where: { id: volunteerId, ...IS_NOT_DELETED },
      select: {
        ...SELECT_TEAMS_CODE,
        availabilities: { select: SELECT_PERIOD },
        assigned: { select: { assignment: { select: SELECT_PERIOD } } },
        breaks: { select: SELECT_PERIOD },
      },
    });

    const extendedTeams = retrieveImplicitTeams(
      volunteer.teams.map(({ teamCode }) => teamCode),
    );

    const assignments = await this.prisma.assignment.findMany({
      where: {
        mobilization: { teams: { some: { teamCode: { in: extendedTeams } } } },
        assignees: { none: { userId: volunteerId } },
        end: { gt: new Date() },
      },
      select: {
        id: true,
        mobilizationId: true,
        ...SELECT_PERIOD,
        festivalTask: {
          select: {
            id: true,
            name: true,
            category: true,
            status: true,
            topPriority: true,
            teamCode: true,
          },
        },
        mobilization: {
          select: { teams: { select: { teamCode: true, count: true } } },
        },
        assignees: {
          select: { userId: true, as: { select: { teamCode: true } } },
        },
        ...friendAssigneesCount(volunteerId),
      },
      orderBy: [{ start: "asc" }, { end: "asc" }, { festivalTaskId: "asc" }],
    });

    return assignments
      .filter((assignment) => {
        const assignmentPeriod = Period.init(assignment);

        const isAvailable = volunteer.availabilities.some((availability) =>
          Period.init(availability).includes(assignmentPeriod),
        );
        const isAssigned = volunteer.assigned.some(({ assignment }) =>
          Period.init(assignment).isOverlapping(assignmentPeriod),
        );
        const isInBreakPeriod = volunteer.breaks.some((breakPeriod) =>
          Period.init(breakPeriod).isOverlapping(assignmentPeriod),
        );

        return isAvailable && !isAssigned && !isInBreakPeriod;
      })
      .map(toAssignmentSummaryWithTask)
      .filter(({ teams }) => teams.length > 0);
  }
}

function toAssignmentSummaryWithTask(
  assignment: DatabaseAssignmentSummaryWithTask,
): AssignmentSummaryWithTask {
  const teams = assignment.mobilization.teams
    .map((team) => ({
      team: team.teamCode,
      demand: team.count,
      assigned: countAssigneesInTeam(
        team.teamCode,
        assignment.assignees.map(({ userId, as }) => ({
          id: userId,
          as: as?.teamCode,
        })),
      ),
    }))
    .filter(({ assigned, demand }) => assigned < demand);

  const hasFriendsAssigned = assignment._count.assignees > 0;

  return {
    assignmentId: assignment.id,
    mobilizationId: assignment.mobilizationId,
    start: assignment.start,
    end: assignment.end,
    taskId: assignment.festivalTask.id,
    task: {
      ...assignment.festivalTask,
      inChargeTeam: assignment.festivalTask.teamCode,
      hasFriendsAssigned,
    },
    teams,
  };
}
