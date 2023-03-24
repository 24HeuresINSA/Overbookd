import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { VolunteerAvailabilityService } from 'src/volunteer-availability/volunteer-availability.service';
import {
  FtWithTimespansResponseDto,
  TimespanWithFtResponseDto,
} from './dto/ftTimespanResponse.dto';
import {
  FtWithTimespansAfterRequest,
  SELECT_FT_WITH_TIMESPANS,
  SELECT_TIMESPAN_WITH_FT,
  TimespanWithFtAfterRequest,
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
      select: SELECT_TIMESPAN_WITH_FT,
    });
    return this.formatTimespansWithFt(ftTimespans);
  }

  async findAllFtsWithTimespans(): Promise<FtWithTimespansResponseDto[]> {
    const fts = await this.prisma.ft.findMany({
      select: SELECT_FT_WITH_TIMESPANS,
    });
    return this.formatFtsWithTimespans(fts);
  }

  async findTimespanWithFt(id: number): Promise<TimespanWithFtResponseDto> {
    const ftTimespan = await this.prisma.ftTimespan.findUnique({
      where: { id },
      select: SELECT_TIMESPAN_WITH_FT,
    });
    return this.formatTimespanWithFt(ftTimespan);
  }

  async findTimespansWithFtAvailableForVolunteer(
    id: number,
  ): Promise<TimespanWithFtResponseDto[]> {
    const availabilities =
      await this.volunteerAvailability.findUserAvailabilities(id);
    const ftTimespans = await this.findAllTimespansWithFt();
    const volunteerTeams = await this.user.getUserTeams(id);

    const ftTimespansFilteredByTeams =
      this.filterTimespansWithFtByVolunteerTeams(ftTimespans, volunteerTeams);
    return this.filterTimespansWithFtByVolunteerAvailabilities(
      ftTimespansFilteredByTeams,
      availabilities,
    );
  }

  private filterTimespansWithFtByVolunteerTeams(
    ftTimespans: TimespanWithFtResponseDto[],
    teams: string[],
  ): TimespanWithFtResponseDto[] {
    return ftTimespans.filter((ftTimespan) => {
      return ftTimespan.requestedTeams.some((team) => teams.includes(team));
    });
  }

  private filterTimespansWithFtByVolunteerAvailabilities(
    ftTimespans: TimespanWithFtResponseDto[],
    availabilities: Period[],
  ): TimespanWithFtResponseDto[] {
    return ftTimespans.filter((ftTimespan) => {
      return this.checkIfVolunteerIsAvailableDuringFtTimespan(
        availabilities,
        ftTimespan,
      );
    });
  }

  checkIfVolunteerIsAvailableDuringFtTimespan(
    availabilities: Period[],
    ftTimespan: TimespanWithFtResponseDto,
  ): boolean {
    return availabilities.some((a) => {
      return (
        a.start.getTime() <= ftTimespan.start.getTime() &&
        a.end.getTime() >= ftTimespan.end.getTime()
      );
    });
  }

  private formatTimespansWithFt(
    ftTimespans: TimespanWithFtAfterRequest[],
  ): TimespanWithFtResponseDto[] {
    return ftTimespans.map((ts) => {
      return this.formatTimespanWithFt(ts);
    });
  }

  private formatTimespanWithFt(
    ftTimespan: TimespanWithFtAfterRequest,
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
    fts: FtWithTimespansAfterRequest[],
  ): FtWithTimespansResponseDto[] {
    return fts.map((ft) => {
      return this.formatFtWithTimespans(ft);
    });
  }

  private formatFtWithTimespans(
    ft: FtWithTimespansAfterRequest,
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
