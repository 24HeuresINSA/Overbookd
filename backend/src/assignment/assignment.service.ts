import { PrismaService } from 'src/prisma.service';
import { SELECT_USER_TEAMS } from 'src/user/user.service';
import { WHERE_VALIDATED_USER } from './volunteer.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FtTeamRequest, FtTimespan, User } from '@prisma/client';
import { AssignmentResponseDto } from './dto/AssignmentResponseDto';
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

function buildTimespanWithStatsSelection(timespanId: number) {
  return {
    ...SELECT_BASE_TIMESPAN,
    timeWindow: {
      select: {
        teamRequests: {
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

const TEAM_ORDER = [
  'conducteur-fen',
  'conducteur',
  'hard',
  'confiance',
  'soft',
];

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
  ): Promise<AssignmentResponseDto> {
    const timespan = await this.retrieveTimespan(timespanId);
    const volunteer = await this.retrieveVolunteer(volunteerId, timespan);

    const teamRequestId = this.retrieveBestTeamRequestId(timespan, volunteer);

    return this.prisma.assignment.create({
      data: {
        timespanId,
        teamRequestId,
        assigneeId: volunteerId,
      },
    });
  }

  private async retrieveTimespan(timespanId: number) {
    const timespan = await this.getTimespanWithItStats(timespanId);

    if (!timespan) {
      throw new NotFoundException(
        "Le créneau n'existe pas. Allez regarder la FT.",
      );
    }
    return timespan;
  }

  private async retrieveVolunteer(
    volunteerId: number,
    timespan: {
      id: number;
      timeWindow: {
        teamRequests: {
          quantity: number;
          id: number;
          teamCode: string;
          _count: { assignments: number };
        }[];
      };
      start: Date;
      end: Date;
    },
  ) {
    const volunteer = await this.getVolunteer(volunteerId, timespan);

    if (!volunteer) {
      throw new NotFoundException(
        "Le bénévole n'a pas été trouvé. Il n'est soit pas disponible, soit déjà affecté à un autre créneau.",
      );
    }
    return volunteer;
  }

  private retrieveBestTeamRequestId(
    timespan: DataBaseTimespanWithStats,
    volunteer: UserWithTeams,
  ) {
    const teamRequestsStats = this.extractTeamRequestsStats(timespan);

    const teamRequestId = this.selectTeamRequestId(
      teamRequestsStats,
      volunteer,
    );

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
  ): Promise<UserWithTeams | null> {
    const availabilities =
      this.buildVolunteerIsAvailableDuringPeriodCondition(ftTimespan);

    const assignments =
      this.buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition(ftTimespan);

    return this.prisma.user.findFirst({
      include: SELECT_USER_TEAMS,
      where: {
        id: volunteerId,
        ...WHERE_VALIDATED_USER,
        availabilities,
        assignments,
      },
    });
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

  private getTimespanWithItStats(timespanId: number) {
    return this.prisma.ftTimespan.findUnique({
      where: { id: timespanId },
      select: buildTimespanWithStatsSelection(timespanId),
    });
  }

  private selectTeamRequestId(
    teamRequests: TeamRequestWithAssignmentStats[],
    volunteer: UserWithTeams,
  ): number {
    const volunteerTeamCodes = this.getAssignableTeamFromVolunteer(volunteer);

    const filteredTeamRequest = teamRequests
      .filter(
        (tr) =>
          tr.quantity > tr.assigned && volunteerTeamCodes.includes(tr.teamCode), // TODO: Add bypass of team code check
      )
      .sort((a, b) => sortByTeamHierarchy(a.teamCode, b.teamCode));

    return filteredTeamRequest.at(0)?.id ?? 0;
  }

  private getAssignableTeamFromVolunteer(volunteer: UserWithTeams): string[] {
    const userTeams = volunteer.team.map((t) => t.team.code);
    return this.getAssignableTeam(userTeams);
  }

  private getAssignableTeam(teamCodes: string[]): string[] {
    const teamHierarchies = teamCodes
      .filter((code) => TEAM_ORDER.includes(code))
      .map(teamHierarchyPosition);
    const mostImportantHierarchyPosition = Math.min(...teamHierarchies);
    return TEAM_ORDER.slice(mostImportantHierarchyPosition);
  }
}

function sortByTeamHierarchy(teamA: string, teamB: string) {
  return teamHierarchyPosition(teamA) - teamHierarchyPosition(teamB);
}

function teamHierarchyPosition(teamCode: string): number {
  return TEAM_ORDER.indexOf(teamCode);
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
