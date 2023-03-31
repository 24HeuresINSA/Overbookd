import { PrismaService } from 'src/prisma.service';
import { TeamService } from 'src/team/team.service';
import { SELECT_USER_TEAMS } from 'src/user/user.service';
import { WHERE_VALIDATED_USER } from './volunteer.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FtTeamRequest, FtTimespan, User } from '@prisma/client';
import { AssignmentResponseDto } from './dto/assignmentResponse.dto';
import { Period } from 'src/volunteer-availability/domain/period.model';

const SELECT_TEAM_REQUEST = {
  id: true,
  teamCode: true,
  quantity: true,
};

const SELECT_BASE_TIMESPAN = {
  id: true,
  start: true,
  end: true,
};

function buildTimespanWithStatsSelection(timespanId: number, teamCode: string) {
  return {
    ...SELECT_BASE_TIMESPAN,
    timeWindow: {
      select: {
        teamRequests: {
          where: { teamCode },
          select: {
            ...SELECT_TEAM_REQUEST,
            _count: {
              select: {
                assignments: { where: { timespanId } },
              },
            },
          },
        },
      },
    },
  };
}

const UNDERLYING_TEAMS = ['hard', 'confiance', 'soft'];

type UserWithTeams = User & {
  team: {
    team: {
      code: string;
    };
  }[];
};

type TeamRequest = Pick<FtTeamRequest, 'quantity' | 'id' | 'teamCode'>;

type DataBaseTeamRequestWithAssignmentStats = TeamRequest & {
  _count: {
    assignments: number;
  };
};

type DataBaseTimespanWithStats = Pick<FtTimespan, 'id' | 'start' | 'end'> & {
  timeWindow: {
    teamRequests: DataBaseTeamRequestWithAssignmentStats[];
  };
};

type TeamRequestWithAssignmentStats = TeamRequest & {
  assigned: number;
};

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async assignVolunteerToTimespan(
    volunteerId: number,
    timespanId: number,
    teamCode: string,
  ): Promise<AssignmentResponseDto> {
    const timespan = await this.retrieveTimespan(timespanId, teamCode);
    await this.checkVolunteerCompatibility(volunteerId, timespan, teamCode);

    const teamRequestId = this.retrieveTeamRequestId(timespan, teamCode);

    return this.prisma.assignment.create({
      data: {
        timespanId,
        teamRequestId,
        assigneeId: volunteerId,
      },
    });
  }

  private async retrieveTimespan(timespanId: number, teamCode: string) {
    const timespan = await this.getTimespanWithItStats(timespanId, teamCode);

    if (!timespan) {
      throw new NotFoundException(
        "Le créneau n'existe pas avec la team demandée. Allez regarder la FT.",
      );
    }
    return timespan;
  }

  private async checkVolunteerCompatibility(
    volunteerId: number,
    timespan: DataBaseTimespanWithStats,
    teamCode: string,
  ) {
    const volunteer = await this.getVolunteer(volunteerId, timespan, teamCode);

    if (!volunteer) {
      throw new NotFoundException(
        'Le bénévole demandé ne peut pas être assigné à ce créneau. Un autre humain vous a peut-être devancé.',
      );
    }
    return volunteer;
  }

  private retrieveTeamRequestId(
    timespan: DataBaseTimespanWithStats,
    teamCode: string,
  ) {
    const teamRequestsStats = this.extractTeamRequestsStats(timespan);

    const teamRequestId = this.selectTeamRequestId(teamRequestsStats, teamCode);

    if (teamRequestId === 0) {
      throw new NotFoundException(
        "Aucune équipe compatible n'est disponible pour ce créneau. Un autre humain vous a peut-être devancé.",
      );
    }
    return teamRequestId;
  }

  private extractTeamRequestsStats(timespan: DataBaseTimespanWithStats) {
    return timespan.timeWindow.teamRequests.map(
      convertToTeamRequestWithAssignmentStats,
    );
  }

  private async getVolunteer(
    volunteerId: number,
    ftTimespan: Period,
    teamCode: string,
  ): Promise<UserWithTeams | null> {
    const availabilities =
      this.buildVolunteerIsAvailableDuringPeriodCondition(ftTimespan);

    const assignments =
      this.buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition(ftTimespan);

    const team = this.buildVolunteerIsMemberOfTeamCondition(teamCode);

    return this.prisma.user.findFirst({
      include: SELECT_USER_TEAMS,
      where: {
        id: volunteerId,
        ...WHERE_VALIDATED_USER,
        availabilities,
        assignments,
        team,
      },
    });
  }

  private buildVolunteerIsMemberOfTeamCondition(teamCode: string) {
    const underlyingTeams = this.getUnderlyingTeams(teamCode);
    const team = TeamService.buildIsMemberOfCondition([
      teamCode,
      ...underlyingTeams,
    ]);
    return team;
  }

  private getUnderlyingTeams(requestedTeamCode: string): string[] {
    const teamIndex = UNDERLYING_TEAMS.indexOf(requestedTeamCode);
    if (teamIndex === -1) return [];
    return UNDERLYING_TEAMS.slice(0, teamIndex);
  }

  private buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition({
    start,
    end,
  }: Period) {
    return {
      every: {
        NOT: [{ timespan: { start: { lt: end }, end: { gt: start } } }],
      },
    };
  }

  private buildVolunteerIsAvailableDuringPeriodCondition({
    start,
    end,
  }: Period) {
    return {
      some: {
        start: {
          lte: start,
        },
        end: {
          gte: end,
        },
      },
    };
  }

  private getTimespanWithItStats(timespanId: number, teamCode: string) {
    return this.prisma.ftTimespan.findFirst({
      where: {
        id: timespanId,
        timeWindow: {
          teamRequests: {
            some: {
              teamCode,
            },
          },
        },
      },
      select: buildTimespanWithStatsSelection(timespanId, teamCode),
    });
  }

  private selectTeamRequestId(
    teamRequests: TeamRequestWithAssignmentStats[],
    teamCode: string,
  ): number {
    const teamRequest = teamRequests.find(
      (tr) => tr.quantity > tr.assigned && tr.teamCode === teamCode,
    );
    return teamRequest?.id ?? 0;
  }
}

function convertToTeamRequestWithAssignmentStats({
  id,
  teamCode,
  quantity,
  _count,
}: DataBaseTeamRequestWithAssignmentStats): TeamRequestWithAssignmentStats {
  return {
    id,
    teamCode,
    quantity,
    assigned: _count.assignments,
  };
}
