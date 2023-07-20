import { Injectable } from '@nestjs/common';
import { Period, QUARTER_IN_MS } from '@overbookd/period';
import { PrismaService } from '../prisma.service';
import { VolunteerAvailability } from '@prisma/client';
import { getPeriodDuration } from '../../src/utils/duration';

interface OrgaNeedsRequest {
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
    orgaNeedsRequest: OrgaNeedsRequest,
  ): Promise<RequestedVolunteersOverPeriod[]> {
    const timeWindows = await this.prisma.ftTimeWindow.findMany({
      where: {
        ...this.periodIncludedCondition(orgaNeedsRequest),
        ...this.teamRequestedCondition(orgaNeedsRequest.teams),
      },
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
        user: this.teamMemberCondition(periodWithTeams.teams),
      },
    });
  }

  private async getAssignments(
    orgaNeedsRequest: OrgaNeedsRequest,
  ): Promise<AssignmentsOverPeriod[]> {
    const teams = orgaNeedsRequest.teams ?? [];

    const assignments = await this.prisma.ftTimeSpan.findMany({
      where: {
        ...this.periodIncludedCondition(orgaNeedsRequest),
        ...this.teamRequestedInTimeWindowCondition(teams),
      },
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
      getPeriodDuration(period) / QUARTER_IN_MS,
    );

    return Array(numberOfIntervals)
      .fill({})
      .map((_, index) => {
        const start = new Date(period.start.getTime() + index * QUARTER_IN_MS);
        const end = new Date(start.getTime() + QUARTER_IN_MS);
        return { start, end };
      });
  }

  private periodIncludedCondition({ start, end }: Period) {
    return {
      start: { lte: end },
      end: { gte: start },
    };
  }

  private teamRequestedCondition(teams: string[]) {
    if (teams.length === 0) return {};
    return {
      teamRequests: { some: { teamCode: { in: teams } } },
    };
  }

  private teamRequestedInTimeWindowCondition(teams: string[]) {
    if (teams.length === 0) return {};
    return { timeWindow: this.teamRequestedCondition(teams) };
  }

  private teamMemberCondition(teams: string[]) {
    const isValidUser = {
      permissions: { some: { permissionName: 'validated-user' } },
    };
    const isMemberOf = { code: { in: teams } };

    const teamCondition = teams.length > 0 ? isMemberOf : isValidUser;

    return {
      teams: {
        some: {
          team: teamCondition,
        },
      },
    };
  }
}

function includedPeriods({ start, end }: Period): (value: Period) => boolean {
  return (period) => period.start < end && period.end > start;
}
