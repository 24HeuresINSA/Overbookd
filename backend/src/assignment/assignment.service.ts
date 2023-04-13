import { Injectable, NotFoundException } from '@nestjs/common';
import { FtTeamRequest, FtTimespan } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TeamService } from 'src/team/team.service';
import { getOtherAssignableTeams } from 'src/team/underlyingTeams.utils';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { WHERE_VALIDATED_USER } from './volunteer.service';

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

const SELECT_ASSIGNMENT = {
  assigneeId: true,
  timespanId: true,
  teamRequestId: true,
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

export type Assignment = {
  assigneeId: number;
  timespanId: number;
  teamRequestId?: number;
  userRequestId?: number;
};

export type VolunteerAssignmentRequest = {
  teamCode: string;
  id: number;
};

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async assignVolunteersToTimespan(
    volunteers: VolunteerAssignmentRequest[],
    timespanId: number,
  ): Promise<Assignment[]> {
    const assignments = await Promise.all(
      volunteers.map((volunteer) =>
        this.prepareAssignment(volunteer, timespanId),
      ),
    );
    return this.prisma.$transaction(
      assignments.map((volunteerAssignment) =>
        this.prisma.assignment.create({
          data: volunteerAssignment,
          select: SELECT_ASSIGNMENT,
        }),
      ),
    );
  }

  private async prepareAssignment(
    { teamCode, id }: { teamCode: string; id: number },
    timespanId: number,
  ): Promise<Assignment> {
    const timespan = await this.retrieveTimespan(timespanId, teamCode);
    await this.checkVolunteerCompatibility(id, timespan, teamCode);

    const teamRequestId = this.retrieveTeamRequestId(timespan, teamCode);
    return {
      timespanId,
      teamRequestId,
      assigneeId: id,
    };
  }

  async unassignVolunteerToTimespan(
    assigneeId: number,
    timespanId: number,
  ): Promise<void> {
    await this.prisma.assignment.deleteMany({
      where: {
        assigneeId,
        timespanId,
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
  ): Promise<void> {
    const volunteer = await this.getVolunteer(volunteerId, timespan, teamCode);

    if (!volunteer) {
      throw new NotFoundException(
        'Le bénévole demandé ne peut pas être assigné à ce créneau. Un autre humain vous a peut-être devancé.',
      );
    }
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
  ): Promise<{ id: number } | null> {
    const availabilities =
      AssignmentService.buildVolunteerIsAvailableDuringPeriodCondition(
        ftTimespan,
      );

    const assignments =
      AssignmentService.buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition(
        ftTimespan,
      );

    const team = this.buildVolunteerIsMemberOfTeamCondition(teamCode);

    return this.prisma.user.findFirst({
      select: { id: true },
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
    const assignableTeams = getOtherAssignableTeams(teamCode);
    const team = TeamService.buildIsMemberOfCondition([
      teamCode,
      ...assignableTeams,
    ]);
    return team;
  }

  static buildVolunteerIsNotAssignedOnTaskDuringPeriodCondition({
    start,
    end,
  }: Period) {
    return {
      every: {
        NOT: [{ timespan: { start: { lt: end }, end: { gt: start } } }],
      },
    };
  }

  static buildVolunteerIsAvailableDuringPeriodCondition({
    start,
    end,
  }: Period) {
    return {
      some: {
        start: { lte: start },
        end: { gte: end },
      },
    };
  }

  private getTimespanWithItStats(timespanId: number, teamCode: string) {
    return this.prisma.ftTimespan.findFirst({
      where: {
        id: timespanId,
        timeWindow: {
          teamRequests: { some: { teamCode } },
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
