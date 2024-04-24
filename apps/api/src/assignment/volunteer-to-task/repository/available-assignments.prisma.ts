import { AssignmentSummaryWithTask } from "@overbookd/http";
import { AvailableAssignments } from "../volunteer-to-task.service";
import { PrismaService } from "../../../prisma.service";
import { SELECT_PERIOD } from "../../common/repository/period.query";
import { IProvidePeriod, Period } from "@overbookd/period";
import { Category } from "@overbookd/festival-event-constants";
import { countAssigneesInTeam } from "@overbookd/assignment";
import { IS_NOT_DELETED } from "../../common/repository/common.query";
import { extendOneOfTeams } from "../../common/extend-teams";

type DatabaseAssignmentSummaryWithTask = IProvidePeriod & {
  id: string;
  mobilizationId: string;
  festivalTask: {
    id: number;
    name: string;
    category: Category;
    topPriority: boolean;
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
        teams: { select: { teamCode: true } },
        availabilities: { select: SELECT_PERIOD },
        assigned: { select: { assignment: { select: SELECT_PERIOD } } },
      },
    });

    const extendedTeams = extendOneOfTeams(
      volunteer.teams.map(({ teamCode }) => teamCode),
    );

    const assignments = await this.prisma.assignment.findMany({
      where: {
        mobilization: { teams: { some: { teamCode: { in: extendedTeams } } } },
        assignees: { none: { userId: volunteerId } },
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
            topPriority: true,
          },
        },
        mobilization: {
          select: { teams: { select: { teamCode: true, count: true } } },
        },
        assignees: {
          select: { userId: true, as: { select: { teamCode: true } } },
        },
        _count: {
          select: {
            assignees: {
              where: {
                personalData: {
                  OR: [
                    { friends: { some: { requestor: { id: volunteerId } } } },
                    {
                      friendRequestors: {
                        some: { friend: { id: volunteerId } },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
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

        return isAvailable && !isAssigned;
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
    name: assignment.festivalTask.name,
    category: assignment.festivalTask.category,
    topPriority: assignment.festivalTask.topPriority,
    teams,
    hasFriendsAssigned,
  };
}
