import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VolunteerAvailability } from '@prisma/client';
import { WHERE_VALIDATED_USER } from 'src/assignment/volunteer.service';
import { OrgaNeedsRequestDto } from './dto/orga-needs-request.dto';

const ONE_MINUTE_IN_MS = 60 * 1000;
const FIFTEEN_MINUTES_IN_MS = 15 * ONE_MINUTE_IN_MS;
const ONE_DAY_IN_MS = 24 * 60 * ONE_MINUTE_IN_MS;

export interface OrgaNeedsResponse {
  start: Date;
  end: Date;
  availableVolunteers: number;
}

@Injectable()
export class OrgaNeedsService {
  constructor(private prisma: PrismaService) {}

  async orgaNeeds(body: OrgaNeedsRequestDto): Promise<OrgaNeedsResponse[]> {
    const { startOfDay, endOfDay } = this.getStartAndEndOfDay(body.selectedDay);
    const intervals = this.buildOrgaNeedsIntervals(startOfDay, endOfDay);
    return this.getAvailableVolunteers(startOfDay, endOfDay, intervals);
  }

  private async getAvailableVolunteers(
    startOfDay: Date,
    endOfDay: Date,
    intervals: OrgaNeedsResponse[],
  ): Promise<OrgaNeedsResponse[]> {
    const availabilities = await this.getAvailabilities(startOfDay, endOfDay);

    for (const availability of availabilities) {
      const start = new Date(availability.start);
      const end = new Date(availability.end);

      for (const interval of intervals) {
        if (start < interval.end && end > interval.start) {
          interval.availableVolunteers += 1;
        }
      }
    }

    return intervals;
  }

  private async getAvailabilities(
    startOfDay: Date,
    endOfDay: Date,
  ): Promise<VolunteerAvailability[]> {
    return this.prisma.volunteerAvailability.findMany({
      where: {
        AND: [{ start: { lte: endOfDay } }, { end: { gte: startOfDay } }],
        user: WHERE_VALIDATED_USER,
      },
    });
  }

  private getStartAndEndOfDay(selectedDay: string) {
    const startOfDay = new Date(selectedDay);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay.getTime() + ONE_DAY_IN_MS);

    return { startOfDay, endOfDay };
  }

  private buildOrgaNeedsIntervals(
    startOfDay: Date,
    endOfDay: Date,
  ): OrgaNeedsResponse[] {
    const numberOfIntervals = Math.floor(
      (endOfDay.getTime() - startOfDay.getTime()) / FIFTEEN_MINUTES_IN_MS,
    );

    return Array(numberOfIntervals)
      .fill({})
      .map((_, index) => {
        const start = new Date(
          startOfDay.getTime() + index * FIFTEEN_MINUTES_IN_MS,
        );
        const end = new Date(start.getTime() + FIFTEEN_MINUTES_IN_MS);
        return { start, end, availableVolunteers: 0 };
      });
  }
}
