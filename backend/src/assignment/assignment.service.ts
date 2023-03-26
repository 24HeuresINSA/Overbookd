import { PrismaService } from 'src/prisma.service';
import { FtTeamRequest, FtTimespan } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignmentResponseDto } from './dto/AssignmentResponseDto';

const TIMESPAN_SELECTOR = {
  id: true,
  start: true,
  end: true,
  timeWindowId: true,
  timeWindow: {
    select: {
      id: true,
      teamRequests: {
        select: {
          id: true,
          teamCode: true,
          quantity: true,
        },
      },
    },
  },
  assignments: {
    select: {
      id: true,
      teamRequest: {
        select: {
          id: true,
          teamCode: true,
          quantity: true,
        },
      },
    },
  },
};

const TEAM_ORDER = ['orga', 'hard', 'confiance', 'soft'];

type SmallTeamRequest = Pick<FtTeamRequest, 'id' | 'teamCode' | 'quantity'>;

type FullTimespan = FtTimespan & {
  timeWindow: {
    id: number;
    teamRequests: SmallTeamRequest[];
  };
  assignments: {
    id: number;
    teamRequest: SmallTeamRequest;
  }[];
};

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async affectVolunteersToTimeSpan(
    volunteerId: number,
    timespanId: number,
  ): Promise<AssignmentResponseDto> {
    const timespan = await this.getTimespan(timespanId);
    const volunteer = await this.getVolunteer(volunteerId, timespan);

    const userTeams = volunteer.team.map((t) => t.team.code);
    const assignableTeams = this.getAssignableTeam(userTeams);

    const teamRequestId = this.getTeamRequestId(timespan, assignableTeams);

    return this.prisma.assignment.create({
      data: {
        timespanId,
        assigneeId: volunteerId,
        teamRequestId,
      },
    });
  }

  private async getVolunteer(volunteerId: number, ftTimespan: FtTimespan) {
    const volunteer = await this.prisma.user.findMany({
      include: {
        team: {
          select: {
            team: {
              select: {
                code: true,
              },
            },
          },
        },
      },
      where: {
        id: volunteerId,
        availabilities: {
          some: {
            start: {
              lte: ftTimespan.start,
            },
            end: {
              gte: ftTimespan.end,
            },
          },
        },
        assignments: {
          every: {
            NOT: [
              {
                OR: [
                  { timespan: { start: { gte: ftTimespan.end } } },
                  { timespan: { end: { lte: ftTimespan.start } } },
                ],
              },
            ],
          },
        },
      },
    });

    if (volunteer.length !== 1) {
      throw new NotFoundException(
        "Le bénévole n'a pas été trouvé. Il n'est soit pas disponible, soit déjà affecté à un autre créneau.",
      );
    }

    return volunteer[0];
  }

  private async getTimespan(timespanId: number): Promise<FullTimespan> {
    const timespan = await this.prisma.ftTimespan.findUnique({
      where: { id: timespanId },
      select: TIMESPAN_SELECTOR,
    });

    if (!timespan) {
      throw new NotFoundException(
        "Le créneau n'existe pas. Aller regarder la FT.",
      );
    }

    return timespan;
  }

  private getTeamRequestId(
    timespan: FullTimespan,
    volunteerTeamCodes: string[],
  ) {
    const countAssignmentsByTeamRequest =
      this.countAssignmentsByTeamRequest(timespan);

    const filteredTeamRequest = timespan.timeWindow.teamRequests.filter(
      (tr) =>
        tr.quantity >
          (countAssignmentsByTeamRequest.find((c) => c.id === tr.id)?.count ||
            0) && volunteerTeamCodes.includes(tr.teamCode), // TODO: Add bypass of team code check
    );

    if (filteredTeamRequest.length === 0) {
      throw new NotFoundException(
        "Aucune équipe compatible n'est disponible pour ce créneau. Un autre humain vous a peut-être devancé.",
      );
    }

    filteredTeamRequest.sort(
      (a, b) => this.indexOfTeam(a.teamCode) - this.indexOfTeam(b.teamCode),
    );
    return filteredTeamRequest[0].id;
  }

  private countAssignmentsByTeamRequest(timespan: FullTimespan) {
    const counts: { [key: number]: number } = timespan.assignments.reduce(
      (acc, assignment) => {
        const teamRequestId = assignment.teamRequest.id;
        acc[teamRequestId] = (acc[teamRequestId] || 0) + 1;
        return acc;
      },
      {},
    );

    return Object.entries(counts).map(([id, count]) => ({
      id: parseInt(id),
      count,
    }));
  }

  private getAssignableTeam(teamCodes: string[]): string[] {
    const teams = [];
    for (const teamCode of teamCodes) {
      teams.push(...this.getUnderlyingTeam(teamCode));
    }

    const sortedTeams = teams.sort(
      (a, b) => this.indexOfTeam(a) - this.indexOfTeam(b),
    );
    return [...new Set(sortedTeams)];
  }

  private getUnderlyingTeam(teamCode: string): string[] {
    const teamIndex = TEAM_ORDER.indexOf(teamCode);
    if (teamIndex === -1) {
      return [teamCode];
    }
    return TEAM_ORDER.slice(teamIndex);
  }

  private indexOfTeam(teamCode: string): number {
    const teamIndex = TEAM_ORDER.indexOf(teamCode);
    return teamIndex === -1 ? -TEAM_ORDER.length : teamIndex;
  }
}
