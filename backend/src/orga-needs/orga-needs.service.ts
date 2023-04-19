import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VolunteerAvailability } from '@prisma/client';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { getPeriodDuration } from 'src/utils/duration';

const ONE_MINUTE_IN_MS = 60 * 1000;
const FIFTEEN_MINUTES_IN_MS = 15 * ONE_MINUTE_IN_MS;

export interface OrgaNeedsRequest {
  start: Date;
  end: Date;
  teams: string[];
}

export interface OrgaNeedsResponse {
  start: Date;
  end: Date;
  assignedVolunteers: number;
  availableVolunteers: number;
  requestedVolunteers: number;
}

const SELECT_REQUESTED_VOLUNTEERS = {
  start: true,
  end: true,
  teamRequests: {
    select: {
      quantity: true,
    },
  },
  _count: {
    select: {
      userRequests: true,
    },
  },
};

const SELECT_ASSIGNED_VOLUNTEERS = {
  start: true,
  end: true,
  _count: {
    select: {
      assignments: true,
    },
  },
};

type RequestedVolunteersOverPeriod = Period & {
  requestedVolunteers: number;
};

type AssignmentsOverPeriod = Period & {
  assigments: number;
};

type DataBaseOrgaStats = {
  interval: Period;
  assignments: AssignmentsOverPeriod[];
  availabilities: VolunteerAvailability[];
  requestedVolunteers: RequestedVolunteersOverPeriod[];
};

@Injectable()
export class OrgaNeedsService {
  constructor(private prisma: PrismaService) {}

  async computeOrgaStats(
    periodAndTeams: OrgaNeedsRequest,
  ): Promise<OrgaNeedsResponse[]> {
    const intervals = this.buildOrgaNeedsIntervals(periodAndTeams);
    const [assignments, availabilities, requestedVolunteers] =
      await Promise.all([
        this.getAssignments(periodAndTeams),
        this.getAvailabilities(periodAndTeams),
        this.getRequestedVolunteers(periodAndTeams),
      ]);

    return intervals.map((interval) =>
      this.formatIntervalStats({
        interval,
        assignments,
        availabilities,
        requestedVolunteers,
      }),
    );
  }

  private formatIntervalStats({
    interval,
    assignments,
    availabilities,
    requestedVolunteers,
  }: DataBaseOrgaStats) {
    const availableVolunteers = this.countAvailableVolunteersOnInterval(
      availabilities,
      interval,
    );

    const requestedVolunteersForInterval =
      this.countRequestedVolunteersOnInterval(requestedVolunteers, interval);

    const assignedVolunteers = this.countAssignedVolunteersOnInterval(
      assignments,
      interval,
    );

    return {
      ...interval,
      assignedVolunteers,
      availableVolunteers,
      requestedVolunteers: requestedVolunteersForInterval,
    };
  }

  private countAssignedVolunteersOnInterval(
    assignments: AssignmentsOverPeriod[],
    interval: Period,
  ) {
    return assignments
      .filter(includedPeriods(interval))
      .reduce((acc, { assigments }) => acc + assigments, 0);
  }

  private countRequestedVolunteersOnInterval(
    requestedVolunteers: RequestedVolunteersOverPeriod[],
    interval: Period,
  ) {
    return requestedVolunteers
      .filter(includedPeriods(interval))
      .reduce((acc, { requestedVolunteers }) => acc + requestedVolunteers, 0);
  }

  private countAvailableVolunteersOnInterval(
    availabilities: VolunteerAvailability[],
    interval: Period,
  ) {
    return availabilities.filter(includedPeriods(interval)).length;
  }

  private async getRequestedVolunteers(
    period: Period,
  ): Promise<RequestedVolunteersOverPeriod[]> {
    const timeWindows = await this.prisma.ftTimeWindows.findMany({
      where: this.periodIncludedCondition(period),
      select: SELECT_REQUESTED_VOLUNTEERS,
    });

    return timeWindows.map(({ start, end, teamRequests, _count }) => {
      const requestedVolunteers =
        teamRequests.reduce((acc, { quantity }) => acc + quantity, 0) +
        _count.userRequests;

      return { start, end, requestedVolunteers };
    });
  }

  private async getAvailabilities(
    periodWithTeams: OrgaNeedsRequest,
  ): Promise<VolunteerAvailability[]> {
    return this.prisma.volunteerAvailability.findMany({
      where: {
        ...this.periodIncludedCondition(periodWithTeams),
        user: this.whereTeamCondition(periodWithTeams.teams),
      },
    });
  }

  private async getAssignments(
    period: Period,
  ): Promise<AssignmentsOverPeriod[]> {
    const assignments = await this.prisma.ftTimespan.findMany({
      where: this.periodIncludedCondition(period),
      select: SELECT_ASSIGNED_VOLUNTEERS,
    });

    return assignments.map(({ start, end, _count }) => ({
      start,
      end,
      assigments: _count.assignments,
    }));
  }

  private buildOrgaNeedsIntervals(period: Period): Period[] {
    const numberOfIntervals = Math.floor(
      getPeriodDuration(period) / FIFTEEN_MINUTES_IN_MS,
    );

    return Array(numberOfIntervals)
      .fill({})
      .map((_, index) => {
        const start = new Date(
          period.start.getTime() + index * FIFTEEN_MINUTES_IN_MS,
        );
        const end = new Date(start.getTime() + FIFTEEN_MINUTES_IN_MS);
        return { start, end };
      });
  }

  private periodIncludedCondition({ start, end }: Period) {
    return {
      start: { lte: end },
      end: { gte: start },
    };
  }

  private whereTeamCondition(teams: string[]) {
    const teamCodes = teams?.length > 0 ? { in: teams } : {};
    return {
      team: {
        some: {
          team: {
            code: teamCodes,
            permissions: {
              some: {
                permission_name: 'validated-user',
              },
            },
          },
        },
      },
    };
  }
}

function includedPeriods({ start, end }: Period): (value: Period) => boolean {
  return (period) => period.start < end && period.end > start;
}
