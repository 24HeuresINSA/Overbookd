import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { VolunteerAvailabilityService } from 'src/volunteer-availability/volunteer-availability.service';
import { FtTimespanResponseDto } from './dto/ftTimespanResponse.dto';
import {
  FtTimespanAfterRequest,
  SELECT_FT_TIMESPAN,
} from './utils/ftTimespanTypes';

@Injectable()
export class FtTimespanService {
  constructor(
    private prisma: PrismaService,
    private volunteerAvailability: VolunteerAvailabilityService,
    private user: UserService,
  ) {}

  async findAllFtTimespans(): Promise<FtTimespanResponseDto[]> {
    const ftTimespans = await this.prisma.ftTimespan.findMany({
      select: SELECT_FT_TIMESPAN,
      orderBy: {
        start: 'asc',
      },
    });
    return this.formatFtTimespans(ftTimespans);
  }

  async findFtTimespan(id: number): Promise<FtTimespanResponseDto> {
    const ftTimespan = await this.prisma.ftTimespan.findUnique({
      where: { id },
      select: SELECT_FT_TIMESPAN,
    });
    return this.formatFtTimespan(ftTimespan);
  }

  async findFtTimespansAvailableForVolunteer(
    id: number,
  ): Promise<FtTimespanResponseDto[]> {
    const availabilities =
      await this.volunteerAvailability.findUserAvailabilities(id);
    const ftTimespans = await this.findAllFtTimespans();
    const volunteerTeams = await this.user.getUserTeams(id);

    const ftTimespansFilteredByTeams = this.filterFtTimespansByVolunteerTeams(
      ftTimespans,
      volunteerTeams,
    );
    return this.filterFtTimespansByVolunteerAvailabilities(
      ftTimespansFilteredByTeams,
      availabilities,
    );
  }

  private filterFtTimespansByVolunteerTeams(
    ftTimespans: FtTimespanResponseDto[],
    teams: string[],
  ): FtTimespanResponseDto[] {
    return ftTimespans.filter((ftTimespan) => {
      return ftTimespan.requestedTeams.some((team) => teams.includes(team));
    });
  }

  private filterFtTimespansByVolunteerAvailabilities(
    ftTimespans: FtTimespanResponseDto[],
    availabilities: Period[],
  ): FtTimespanResponseDto[] {
    return ftTimespans.filter((ftTimespan) => {
      return this.checkIfVolunteerIsAvailableDuringFtTimespan(
        availabilities,
        ftTimespan,
      );
    });
  }

  checkIfVolunteerIsAvailableDuringFtTimespan(
    availabilities: Period[],
    ftTimespan: FtTimespanResponseDto,
  ): boolean {
    return availabilities.some((a) => {
      return (
        a.start.getTime() <= ftTimespan.start.getTime() &&
        a.end.getTime() >= ftTimespan.end.getTime()
      );
    });
  }

  private formatFtTimespans(
    ftTimespans: FtTimespanAfterRequest[],
  ): FtTimespanResponseDto[] {
    return ftTimespans.map((ts) => {
      return this.formatFtTimespan(ts);
    });
  }

  private formatFtTimespan(
    ftTimespan: FtTimespanAfterRequest,
  ): FtTimespanResponseDto {
    const requestedTeams = ftTimespan.timeWindows.teamRequests.map(
      (tr) => tr.team.code,
    );
    return {
      id: ftTimespan.id,
      start: ftTimespan.start,
      end: ftTimespan.end,
      hasPriority: ftTimespan.hasPriority,
      category: ftTimespan.category,
      ft: {
        id: ftTimespan.timeWindows.ft.id,
        name: ftTimespan.timeWindows.ft.name,
      },
      requestedTeams,
    };
  }
}
