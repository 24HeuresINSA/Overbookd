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

const SELECT_TIMESPAN_WITH_STATS = {
  ...SELECT_BASE_TIMESPAN,
  timeWindow: {
    select: {
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

type TeamRequest = Pick<FtTeamRequest, 'id' | 'teamCode' | 'quantity'>;

type DataBaseTimespanWithStats = Pick<FtTimespan, 'id' | 'start' | 'end'> & {
  timeWindow: {
    teamRequests: TeamRequest[];
  };
  assignments: {
    id: number;
    teamRequest: TeamRequest;
  }[];
};

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async assignVolunteerToTimeSpan(
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

  private async retrieveTimespan(
    timespanId: number,
  ): Promise<DataBaseTimespanWithStats> {
    const timespan = await this.getTimespanWithStats(timespanId);

    if (!timespan) {
      throw new NotFoundException(
        "Le créneau n'existe pas. Allez regarder la FT.",
      );
    }

    return timespan;
  }

  private async getTimespanWithStats(
    timespanId: number,
  ): Promise<DataBaseTimespanWithStats> {
    const timespan = await this.prisma.ftTimespan.findUnique({
      where: { id: timespanId },
      select: SELECT_TIMESPAN_WITH_STATS,
    });

    if (!timespan) {
      throw new NotFoundException(
        "Le créneau n'existe pas. Allez regarder la FT.",
      );
    }

    return timespan;
  }

  private async retrieveVolunteer(
    volunteerId: number,
    ftTimespan: DataBaseTimespanWithStats,
  ): Promise<UserWithTeams> {
    const volunteer = await this.getVolunteer(volunteerId, ftTimespan);

    if (!volunteer) {
      throw new NotFoundException(
        "Le bénévole n'a pas été trouvé. Il n'est soit pas disponible, soit déjà affecté à un autre créneau.",
      );
    }

    return volunteer;
  }

  private async getVolunteer(
    volunteerId: number,
    ftTimespan: DataBaseTimespanWithStats,
  ): Promise<UserWithTeams> {
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
        NOT: { assignments },
      },
    });
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

  private buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition({
    start,
    end,
  }: Period) {
    return {
      some: {
        AND: [
          { timespan: { start: { lt: end } } },
          { timespan: { end: { gt: start } } },
        ],
      },
    };
  }

  private retrieveBestTeamRequestId(
    timespan: DataBaseTimespanWithStats,
    volunteer: UserWithTeams,
  ): number {
    const teamRequestId = this.selectTeamRequestId(timespan, volunteer);

    if (!teamRequestId) {
      throw new NotFoundException(
        "Aucune équipe compatible n'est disponible pour ce créneau. Un autre humain vous a peut-être devancé.",
      );
    }

    return teamRequestId;
  }

  private selectTeamRequestId(
    timespan: DataBaseTimespanWithStats,
    volunteer: UserWithTeams,
  ): number {
    console.dir(timespan, { depth: null });
    console.dir(volunteer, { depth: null });
    const countAssignmentsByTeamRequest =
      this.countAssignmentsByTeamRequest(timespan);
    console.dir(countAssignmentsByTeamRequest);

    const volunteerTeamCodes = this.getAssignableTeamFromVolunteer(volunteer);
    console.dir(volunteerTeamCodes);

    const filteredTeamRequest = timespan.timeWindow.teamRequests.filter(
      (tr) =>
        tr.quantity >
          (countAssignmentsByTeamRequest.find((c) => c.id === tr.id)?.count ||
            0) && volunteerTeamCodes.includes(tr.teamCode), // TODO: Add bypass of team code check
    );

    filteredTeamRequest.sort(
      (a, b) => this.indexOfTeam(a.teamCode) - this.indexOfTeam(b.teamCode),
    );
    return filteredTeamRequest.at(0)?.id ?? 0;
  }

  private getAssignableTeamFromVolunteer(volunteer: UserWithTeams): string[] {
    const userTeams = volunteer.team.map((t) => t.team.code);
    return this.getAssignableTeams(userTeams);
  }

  private countAssignmentsByTeamRequest(timespan: DataBaseTimespanWithStats) {
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

  private getAssignableTeams(teamCodes: string[]): string[] {
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
    return TEAM_ORDER.indexOf(teamCode);
  }
}
