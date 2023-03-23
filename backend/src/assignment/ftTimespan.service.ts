import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { VolunteerAvailabilityService } from 'src/volunteer-availability/volunteer-availability.service';
import { FtTimespan } from './dto/ftTimespanResponse';
import { FtTimespanAfterRequest, SELECT_FT_TIMESPAN } from './ftTimespanTypes';

@Injectable()
export class FtTimespanService {
  constructor(
    private prisma: PrismaService,
    private volunteerAvailability: VolunteerAvailabilityService,
  ) {}

  async findAllFtTimespans(): Promise<FtTimespan[]> {
    return this.requestFtTimespan();
  }

  async findFtTimespansAvailableForVolunteer(
    id: number,
  ): Promise<FtTimespan[]> {
    const availabilities =
      await this.volunteerAvailability.findUserAvailabilities(id);
    const ftTimespans = await this.requestFtTimespan();
    const volunteerTeams = await this.getVolunteerTeams(id);

    const ftTimespansFilteredByTeams = this.filterFtTimespansByVolunteerTeams(
      ftTimespans,
      volunteerTeams,
    );
    return this.filterFtTimespansByVolunteerAvailabilities(
      ftTimespansFilteredByTeams,
      availabilities,
    );
  }

  private async requestFtTimespan(): Promise<FtTimespan[]> {
    const ftTimespans = await this.prisma.ftTimespan.findMany({
      select: SELECT_FT_TIMESPAN,
      orderBy: {
        start: 'asc',
      },
    });
    return this.formatFtTimespans(ftTimespans);
  }

  private async getVolunteerTeams(id: number): Promise<string[]> {
    const volunteer = await this.prisma.user.findUnique({
      where: { id },
      select: {
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
    });
    return volunteer.team.map((t) => t.team.code);
  }

  private filterFtTimespansByVolunteerTeams(
    ftTimespans: FtTimespan[],
    teams: string[],
  ): FtTimespan[] {
    return ftTimespans.filter((ftTimespan) => {
      return ftTimespan.requestedTeams.some((team) => teams.includes(team));
    });
  }

  private filterFtTimespansByVolunteerAvailabilities(
    ftTimespans: FtTimespan[],
    availabilities: Period[],
  ): FtTimespan[] {
    return ftTimespans.filter((ftTimespan) => {
      return this.checkIfVolunteerIsAvailableDuringFtTimespan(
        availabilities,
        ftTimespan,
      );
    });
  }

  private checkIfVolunteerIsAvailableDuringFtTimespan(
    availabilities: Period[],
    ftTimespan: FtTimespan,
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
  ): FtTimespan[] {
    return ftTimespans.map((ts) => {
      return this.formatFtTimespan(ts);
    });
  }

  private formatFtTimespan(ftTimespan: FtTimespanAfterRequest): FtTimespan {
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
