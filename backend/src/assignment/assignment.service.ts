import { PrismaService } from 'src/prisma.service';
import { SELECT_USER_TEAMS } from 'src/user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FtTeamRequest, FtTimespan, User } from '@prisma/client';
import { AssignmentResponseDto } from './dto/AssignmentResponseDto';

const SELECT_TEAM_REQUEST = {
  id: true,
  teamCode: true,
  quantity: true,
};

const TIMESPAN_SELECTOR = {
  id: true,
  start: true,
  end: true,
  timeWindowId: true,
  timeWindow: {
    select: {
      id: true,
      teamRequests: {
        select: SELECT_TEAM_REQUEST,
      },
    },
  },
  assignments: {
    select: {
      id: true,
      teamRequest: {
        select: SELECT_TEAM_REQUEST,
      },
    },
  },
};

const TEAM_ORDER = ['orga', 'hard', 'confiance', 'soft'];

type UserWithTeams = User & {
  team: {
    team: {
      code: string;
    };
  }[];
};

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

    const teamRequestId = this.getTeamRequestId(timespan, volunteer);

    return this.prisma.assignment.create({
      data: {
        timespanId,
        teamRequestId,
        assigneeId: volunteerId,
      },
    });
  }

  private async getVolunteer(
    volunteerId: number,
    ftTimespan: FullTimespan,
  ): Promise<UserWithTeams> {
    const volunteer = await this.prisma.user.findFirst({
      include: SELECT_USER_TEAMS,
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

    if (!volunteer) {
      throw new NotFoundException(
        "Le bénévole n'a pas été trouvé. Il n'est soit pas disponible, soit déjà affecté à un autre créneau.",
      );
    }

    return volunteer;
  }

  private async getTimespan(timespanId: number): Promise<FullTimespan> {
    const timespan = await this.prisma.ftTimespan.findUnique({
      where: { id: timespanId },
      select: TIMESPAN_SELECTOR,
    });

    if (!timespan) {
      throw new NotFoundException(
        "Le créneau n'existe pas. Allez regarder la FT.",
      );
    }

    return timespan;
  }

  private getTeamRequestId(
    timespan: FullTimespan,
    volunteer: UserWithTeams,
  ): number {
    const countAssignmentsByTeamRequest =
      this.countAssignmentsByTeamRequest(timespan);

    const volunteerTeamCodes = this.getAssignableTeamFromVolunteer(volunteer);

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

  private getAssignableTeamFromVolunteer(volunteer: UserWithTeams): string[] {
    const userTeams = volunteer.team.map((t) => t.team.code);
    return this.getAssignableTeam(userTeams);
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
