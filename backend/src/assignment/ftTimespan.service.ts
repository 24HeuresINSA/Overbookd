import { Injectable, NotFoundException } from '@nestjs/common';
import { FtStatus, TaskCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TeamService } from 'src/team/team.service';
import { getUnderlyingTeams } from 'src/team/underlyingTeams.utils';
import { UserService } from 'src/user/user.service';
import { PeriodDto } from 'src/volunteer-availability/dto/period.dto';
import { VolunteerAvailabilityService } from 'src/volunteer-availability/volunteer-availability.service';
import {
  FtWithTimespansResponseDto,
  RequestedTeam,
  TimespanWithFtResponseDto,
} from './dto/ftTimespanResponse.dto';
import {
  DatabaseFtWithTimespans,
  DatabaseRequestedTeam,
  DatabaseTimespanWithFt,
  SELECT_FT_WITH_TIMESPANS,
  SELECT_TIMESPAN_WITH_FT,
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

@Injectable()
export class FtTimespanService {
  constructor(
    private prisma: PrismaService,
    private volunteerAvailability: VolunteerAvailabilityService,
    private user: UserService,
  ) {}

  async findAllTimespansWithFt(): Promise<TimespanWithFtResponseDto[]> {
    const ftTimespans = await this.prisma.ftTimespan.findMany({
      where: {
        timeWindow: WHERE_FT_EXISTS_AND_READY,
      },
      select: SELECT_TIMESPAN_WITH_FT,
    });
    return this.formatTimespansWithFt(ftTimespans);
  }

  async findAllFtsWithTimespans(): Promise<FtWithTimespansResponseDto[]> {
    const fts = await this.prisma.ft.findMany({
      where: {
        ...WHERE_EXISTS_AND_READY,
        ...WHERE_HAS_TEAM_REQUESTS,
      },
      select: SELECT_FT_WITH_TIMESPANS,
    });
    return this.formatFtsWithTimespans(fts);
  }

  async findTimespanWithFt(
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

  async getCategoryByTimespan(timespanId: number): Promise<TaskCategory> {
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
      const requestedTeams = this.formatRequestedTeams(tw.teamRequests);
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
  ): RequestedTeam[] {
    return requestedTeams.map((tr) => {
      const assignmentCount = tr._count.assignments;
      return { code: tr.teamCode, quantity: tr.quantity, assignmentCount };
    });
  }
}
