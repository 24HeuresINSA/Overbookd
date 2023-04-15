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
}

@Injectable()
export class OrgaNeedsService {
  constructor(private prisma: PrismaService) {}

  async orgaNeeds(period: Period): Promise<OrgaNeedsResponse[]> {
    const intervals = this.buildOrgaNeedsIntervals(period);
    return this.getAvailableVolunteers(period, intervals);
  }

  private async getAvailableVolunteers(
    period: Period,
    intervals: Period[],
  ): Promise<OrgaNeedsResponse[]> {
    const availabilities = await this.getAvailabilities(period);

    return intervals.map(({ start, end }) => {
      const availableVolunteers = availabilities.filter(
        (availability) => availability.start < end && availability.end > start,
      ).length;
      return { start, end, availableVolunteers };
    });
  }

  private async getAvailabilities({
    start,
    end,
  }: Period): Promise<VolunteerAvailability[]> {
    return this.prisma.volunteerAvailability.findMany({
      where: {
        start: { lte: end },
        end: { gte: start },
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
}
