import { Injectable, NotFoundException } from '@nestjs/common';
import { FtStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { VolunteerAvailabilityService } from 'src/volunteer-availability/volunteer-availability.service';
import {
  FtWithTimespansResponseDto,
  TimespanWithFtResponseDto,
} from './dto/ftTimespanResponse.dto';
import {
  DatabaseFtWithTimespans,
  DatabaseTimespanWithFt,
  SELECT_FT_WITH_TIMESPANS,
  SELECT_TIMESPAN_WITH_FT,
} from './types/ftTimespanTypes';

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
        timeWindow: {
          ft: {
            isDeleted: false,
            status: FtStatus.READY,
          },
        },
      },
      select: SELECT_TIMESPAN_WITH_FT,
    });
    return this.formatTimespansWithFt(ftTimespans);
  }

  async findAllFtsWithTimespans(): Promise<FtWithTimespansResponseDto[]> {
    const fts = await this.prisma.ft.findMany({
      where: {
        isDeleted: false,
        status: FtStatus.READY,
      },
      select: SELECT_FT_WITH_TIMESPANS,
    });
    return this.formatFtsWithTimespans(fts);
  }

  async findTimespanWithFt(
    timespanId: number,
  ): Promise<TimespanWithFtResponseDto> {
    const ftTimespan = await this.prisma.ftTimespan.findUnique({
      where: {
        id: timespanId,
      },
      select: SELECT_TIMESPAN_WITH_FT,
    });
    if (!ftTimespan) {
      throw new NotFoundException(`Timespan with id ${timespanId} not found`);
    }
    return this.formatTimespanWithFt(ftTimespan);
  }

  async findTimespansWithFtAvailableForVolunteer(
    volunteerId: number,
  ): Promise<TimespanWithFtResponseDto[]> {
    const [volunteerTeams, availabilities] = await Promise.all([
      this.user.getUserTeams(volunteerId),
      this.volunteerAvailability.findUserAvailabilities(volunteerId),
    ]);

    const timespans = await this.prisma.ftTimespan.findMany({
      select: SELECT_TIMESPAN_WITH_FT,
      where: {
        AND: [
          {
            timeWindow: {
              teamRequests: {
                some: {
                  team: {
                    code: {
                      in: volunteerTeams,
                    },
                  },
                },
              },
            },
          },
          {
            OR: availabilities.map((availability) => ({
              start: {
                gte: availability.start,
                lte: availability.end,
              },
              end: {
                gte: availability.start,
                lte: availability.end,
              },
            })),
          },
          {
            timeWindow: {
              ft: {
                isDeleted: false,
                status: FtStatus.READY,
              },
            },
          },
        ],
      },
    });
    return this.formatTimespansWithFt(timespans);
  }

  private formatTimespansWithFt(
    ftTimespans: DatabaseTimespanWithFt[],
  ): TimespanWithFtResponseDto[] {
    return ftTimespans.map((ts) => this.formatTimespanWithFt(ts));
  }

  private formatTimespanWithFt(
    ftTimespan: DatabaseTimespanWithFt,
  ): TimespanWithFtResponseDto {
    const requestedTeams = ftTimespan.timeWindow.teamRequests.map(
      (tr) => tr.team.code,
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
      const requestedTeams = tw.teamRequests.map((tr) => tr.team.code);
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
}
