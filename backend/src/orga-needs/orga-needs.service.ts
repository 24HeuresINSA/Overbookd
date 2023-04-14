import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrgaNeedsResponseDto } from './dto/orga-needs-response.dto';
import { VolunteerAvailability } from '@prisma/client';
import { WHERE_VALIDATED_USER } from 'src/assignment/volunteer.service';

const TIME_IN_ONE_MINUTE = 60 * 1000;
const TIME_IN_15_MINUTES = 15 * TIME_IN_ONE_MINUTE;

@Injectable()
export class OrgaNeedsService {
  constructor(private prisma: PrismaService) {}

  async orgaNeeds(selectedDay: Date): Promise<OrgaNeedsResponseDto[]> {
    const { startOfDay, endOfDay } = this.getStartAndEndOfDay(selectedDay);
    const intervals = this.buildOrgaNeedsIntervals(startOfDay);
    return this.getAvailableVolunteers(startOfDay, endOfDay, intervals);
  }

  private async getAvailableVolunteers(
    startOfDay: Date,
    endOfDay: Date,
    intervals: OrgaNeedsResponseDto[],
  ): Promise<OrgaNeedsResponseDto[]> {
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

  private getStartAndEndOfDay(selectedDay: Date) {
    const startOfDay = new Date(selectedDay);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDay);
    endOfDay.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
  }

  private buildOrgaNeedsIntervals(startOfDay: Date): OrgaNeedsResponseDto[] {
    return Array(96)
      .fill({})
      .map((_, index) => {
        const start = new Date(
          startOfDay.getTime() + index * TIME_IN_15_MINUTES,
        );
        const end = new Date(start.getTime() + TIME_IN_15_MINUTES);
        return { start, end, availableVolunteers: 0 };
      });
  }
}
