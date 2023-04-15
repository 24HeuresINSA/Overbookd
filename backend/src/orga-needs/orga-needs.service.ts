import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VolunteerAvailability } from '@prisma/client';
import { WHERE_VALIDATED_USER } from 'src/assignment/volunteer.service';
import { Period } from 'src/volunteer-availability/domain/period.model';

const ONE_MINUTE_IN_MS = 60 * 1000;
const FIFTEEN_MINUTES_IN_MS = 15 * ONE_MINUTE_IN_MS;

export interface OrgaNeedsResponse {
  start: Date;
  end: Date;
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

type RequestedVolunteersOverPeriod = Period & {
  requestedVolunteers: number;
};

@Injectable()
export class OrgaNeedsService {
  constructor(private prisma: PrismaService) {}

  async orgaNeeds(period: Period): Promise<OrgaNeedsResponse[]> {
    const intervals = this.buildOrgaNeedsIntervals(period);
    const [availabilities, requestedVolunteers] = await Promise.all([
      this.getAvailabilities(period),
      this.getRequestedVolunteers(period),
    ]);

    return intervals.map((interval) =>
      this.formatIntervalStats(interval, availabilities, requestedVolunteers),
    );
  }

  private formatIntervalStats(
    interval: Period,
    availabilities: VolunteerAvailability[],
    requestedVolunteers: RequestedVolunteersOverPeriod[],
  ) {
    const availableVolunteers = this.countAvailableVolunteersOnInterval(
      availabilities,
      interval,
    );

    const requestedVolunteersForInterval =
      this.countRequestedVolunteersOnInterval(requestedVolunteers, interval);

    return {
      start: interval.start,
      end: interval.end,
      availableVolunteers,
      requestedVolunteers: requestedVolunteersForInterval,
    };
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
    period: Period,
  ): Promise<VolunteerAvailability[]> {
    return this.prisma.volunteerAvailability.findMany({
      where: {
        ...this.periodIncludedCondition(period),
        user: WHERE_VALIDATED_USER,
      },
    });
  }

  private buildOrgaNeedsIntervals({
    start: periodStart,
    end: periodEnd,
  }: Period): Period[] {
    const numberOfIntervals = Math.floor(
      (periodEnd.getTime() - periodStart.getTime()) / FIFTEEN_MINUTES_IN_MS,
    );

    return Array(numberOfIntervals)
      .fill({})
      .map((_, index) => {
        const start = new Date(
          periodStart.getTime() + index * FIFTEEN_MINUTES_IN_MS,
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
}

function includedPeriods({ start, end }: Period): (value: Period) => boolean {
  return (period) => period.start < end && period.end > start;
}
