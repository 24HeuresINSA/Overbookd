import { Injectable, NotFoundException } from '@nestjs/common';
import { FtStatus, TaskCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TeamService } from 'src/team/team.service';
import { getUnderlyingTeams } from 'src/team/underlyingTeams.utils';
import { UserService } from 'src/user/user.service';
import { PeriodDto } from 'src/volunteer-availability/dto/period.dto';
import { VolunteerAvailabilityService } from 'src/volunteer-availability/volunteer-availability.service';
import {
  TimespanWithFtResponseDto,
  FtWithTimespansResponseDto,
} from './dto/ftTimespanResponse.dto';
import {
  DatabaseFtWithTimespans,
  DatabaseRequestedTeam,
  DatabaseTimespanWithFt,
  Timespan,
  SELECT_FT_WITH_TIMESPANS,
  SELECT_TIMESPAN_WITH_FT,
  RequestedTeam,
  DatabaseTimeWindow,
  FtWithTimespan,
  DatabaseTimespanWithAssignedTeamMembers,
  AssignmentAsTeamMember as AssignedAsTeamMember,
} from './types/ftTimespanTypes';

const WHERE_EXISTS_AND_READY = {
  isDeleted: false,
  status: FtStatus.READY,
};

const WHERE_FT_EXISTS_AND_READY = {
  ft: WHERE_EXISTS_AND_READY,
};

const WHERE_HAS_TEAM_REQUESTS = {
  timeWindows: {
    some: {
      teamRequests: {
        some: {},
      },
    },
  },
};

const SELECT_FT_TIMESPANS_WITH_STATS = {
  timeWindows: {
    select: {
      teamRequests: {
        select: {
          teamCode: true,
          quantity: true,
          _count: {
            select: {
              assignments: true,
            },
          },
        },
      },
      timespans: {
        select: {
          id: true,
          start: true,
          end: true,
          assignments: {
            select: {
              teamRequest: {
                select: {
                  teamCode: true,
                },
              },
            },
            where: {
              userRequest: null,
            },
          },
        },
      },
    },
  },
};

@Injectable()
export class FtTimespanService {
  constructor(
    private prisma: PrismaService,
    private volunteerAvailability: VolunteerAvailabilityService,
    private user: UserService,
  ) {}

  async findAllFtsWithTimespans(): Promise<FtWithTimespan[]> {
    const fts = await this.prisma.ft.findMany({
      where: {
        ...WHERE_EXISTS_AND_READY,
        ...WHERE_HAS_TEAM_REQUESTS,
      },
      select: SELECT_FT_WITH_TIMESPANS,
    });
    return this.formatFtsWithTimespans(fts);
  }

  async findTimespansForFt(ftId: number): Promise<Timespan[]> {
    const ft = await this.prisma.ft.findFirst({
      where: {
        id: ftId,
        ...WHERE_EXISTS_AND_READY,
        ...WHERE_HAS_TEAM_REQUESTS,
      },
      select: SELECT_FT_TIMESPANS_WITH_STATS,
    });

    if (!ft) {
      throw new NotFoundException(`FT with id ${ftId} not found`);
    }

    return this.formatTimespansWithStatsResponse(ft);
  }

  private formatTimespansWithStatsResponse(ft: {
    timeWindows: DatabaseTimeWindow[];
  }): Timespan[] {
    return ft.timeWindows.flatMap(({ timespans, teamRequests }) =>
      timespans.flatMap(convertToTimespan(teamRequests)),
    );
  }

  async findTimespanWithFtAndAssignments(
    timespanId: number,
  ): Promise<TimespanWithFtResponseDto> {
    const ftTimespan = await this.prisma.ftTimespan.findFirst({
      where: {
        id: timespanId,
        timeWindow: WHERE_FT_EXISTS_AND_READY,
      },
      select: SELECT_TIMESPAN_WITH_FT,
    });
    if (!ftTimespan) {
      throw new NotFoundException(`Timespan with id ${timespanId} not found`);
    }
    return this.formatTimespanWithFt(ftTimespan);
  }

  async findTimespansWithFtWhereVolunteerIsAssignableTo(
    volunteerId: number,
  ): Promise<TimespanWithFtResponseDto[]> {
    const [volunteerTeams, availabilities] = await Promise.all([
      this.user.getUserTeams(volunteerId),
      this.volunteerAvailability.findUserAvailabilities(volunteerId),
    ]);

    const where = this.buildAssignableToTimespanCondition(
      volunteerTeams,
      availabilities,
    );

    const timespans = await this.prisma.ftTimespan.findMany({
      select: SELECT_TIMESPAN_WITH_FT,
      where,
    });
    return this.formatTimespansWithFt(timespans);
  }

  async getTaskCategory(timespanId: number): Promise<TaskCategory | null> {
    const ftTimespan = await this.prisma.ftTimespan.findFirst({
      where: {
        id: timespanId,
        timeWindow: WHERE_FT_EXISTS_AND_READY,
      },
      select: {
        timeWindow: {
          select: {
            ft: {
              select: {
                category: true,
              },
            },
          },
        },
      },
    });
    if (!ftTimespan) {
      throw new NotFoundException(`Créneau ${timespanId} non trouvé`);
    }
    return ftTimespan.timeWindow.ft.category;
  }

  private buildAssignableToTimespanCondition(
    volunteerTeams: string[],
    availabilities: PeriodDto[],
  ) {
    const underlyingTeams = getUnderlyingTeams(volunteerTeams);
    const teams = [...volunteerTeams, ...underlyingTeams];
    const teamRequests = TeamService.buildIsMemberOfCondition(teams);

    const availabilitiesCondition =
      this.buildTimespanConditionOverAvailability(availabilities);

    return {
      timeWindow: {
        teamRequests,
        ...WHERE_FT_EXISTS_AND_READY,
      },
      ...availabilitiesCondition,
    };
  }

  private buildTimespanConditionOverAvailability(availabilities: PeriodDto[]) {
    return {
      OR: availabilities.map((availability) => ({
        start: {
          gte: availability.start,
        },
        end: {
          lte: availability.end,
        },
      })),
    };
  }

  private formatTimespansWithFt(
    ftTimespans: DatabaseTimespanWithFt[],
  ): TimespanWithFtResponseDto[] {
    return ftTimespans.map((ts) => this.formatTimespanWithFt(ts));
  }

  private formatTimespanWithFt(
    ftTimespan: DatabaseTimespanWithFt,
  ): TimespanWithFtResponseDto {
    const requestedTeams = this.formatRequestedTeams(
      ftTimespan.timeWindow.teamRequests,
      ftTimespan.timeWindow._count.timespans,
    );
    return {
      id: ftTimespan.id,
      start: ftTimespan.start,
      end: ftTimespan.end,
      ft: {
        id: ftTimespan.timeWindow.ft.id,
        name: ftTimespan.timeWindow.ft.name,
        hasPriority: ftTimespan.timeWindow.ft.hasPriority,
        category: ftTimespan.timeWindow.ft.category,
      },
      requestedTeams,
      assignees: formatTimespanAssignees(ftTimespan),
    };
  }

  private formatFtsWithTimespans(
    fts: DatabaseFtWithTimespans[],
  ): FtWithTimespansResponseDto[] {
    return fts.map((ft) => this.formatFtWithTimespans(ft));
  }

  private formatFtWithTimespans(
    ft: DatabaseFtWithTimespans,
  ): FtWithTimespansResponseDto {
    const timespans = ft.timeWindows.flatMap((tw) => {
      const requestedTeams = this.formatRequestedTeams(
        tw.teamRequests,
        tw._count.timespans,
      );
      return tw.timespans.map((ts) => {
        return {
          id: ts.id,
          start: ts.start,
          end: ts.end,
          requestedTeams,
        };
      });
    });
    return {
      id: ft.id,
      name: ft.name,
      hasPriority: ft.hasPriority,
      category: ft.category,
      timespans,
    };
  }

  private formatRequestedTeams(
    requestedTeams: DatabaseRequestedTeam[],
    impactedTimespans: number,
  ): RequestedTeam[] {
    return requestedTeams.map((tr) => {
      const assignmentCount = tr._count.assignments;
      const globalQuantity = tr.quantity * impactedTimespans;
      return { code: tr.teamCode, quantity: globalQuantity, assignmentCount };
    });
  }
}

function convertToTimespan(
  teamRequests: DatabaseRequestedTeam[],
): (value: DatabaseTimespanWithAssignedTeamMembers) => Timespan {
  return ({ assignments, ...timespan }) => {
    const requestedTeams = teamRequests.map((teamRequest) =>
      convertToRequestedTeam(teamRequest, assignments),
    );
    return {
      ...timespan,
      requestedTeams,
    };
  };
}

function formatTimespanAssignees(ftTimespan: DatabaseTimespanWithFt): number[] {
  return ftTimespan.assignments.map(({ assignee }) => assignee.id);
}

function convertToRequestedTeam(
  teamRequest: DatabaseRequestedTeam,
  assignments: AssignedAsTeamMember[],
): RequestedTeam {
  const assignmentCount = countMemberAssigned(
    assignments,
    teamRequest.teamCode,
  );
  return {
    code: teamRequest.teamCode,
    quantity: teamRequest.quantity,
    assignmentCount,
  };
}

function countMemberAssigned(
  assignments: AssignedAsTeamMember[],
  code: string,
) {
  return assignments.filter(({ teamRequest }) => teamRequest?.teamCode === code)
    .length;
}
