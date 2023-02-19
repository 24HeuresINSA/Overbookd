import { ForbiddenException, Injectable } from '@nestjs/common';
import { VolunteerAvailability } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import {
  CreateVolunteerAvailabilityDto,
  Period,
} from './dto/createVolunteerAvailability.dto';
import { VolunteerAvailabilityResponseDto } from './dto/volunteerAvailabilityResponse.dto';

@Injectable()
export class VolunteerAvailabilityService {
  constructor(private prisma: PrismaService) {}

  async addAvailabilities(
    userId: number,
    createVolunteerAvailability: CreateVolunteerAvailabilityDto,
  ): Promise<VolunteerAvailabilityResponseDto> {
    /**
     * First step : check that new availabilities are longer than older ones
     * Second step : compute new charisma points based on this availabilities
     * Third step : update the user with the new charisma points and the new availabilities through a transaction
     */
    const newPeriods = createVolunteerAvailability.periods;
    const oldAvailabilities = await this.prisma.volunteerAvailability
      .findMany({
        where: {
          userId,
        },
      })
      .then((el: VolunteerAvailability[]) => {
        return el.map((av) => {
          return {
            start: av.start,
            end: av.end,
          };
        });
      });
    if (oldAvailabilities.length > 0) {
      const oldAvailabilitiesDuration = oldAvailabilities.reduce(
        (acc, curr) => acc + this.getPeriodDuration(curr),
        0,
      );
      const newAvailabilitiesDuration = newPeriods.reduce(
        (acc, curr) => acc + this.getPeriodDuration(curr),
        0,
      );
      if (newAvailabilitiesDuration < oldAvailabilitiesDuration) {
        throw new ForbiddenException(
          'New availabilities are shorter than older ones. Please add more periods.',
        );
      }
    }
    console.log('New availabilities are longer than older ones');
    let newCharismaPoints = 0;
    for (const period of newPeriods) {
      newCharismaPoints += await this.computeCharismaPoints(period);
    }
    return null;
  }

  private getPeriodDuration(params: Period): number {
    return Math.floor(
      (new Date(params.end).getTime() - new Date(params.start).getTime()) /
        1000,
    );
  }

  private async computeCharismaPoints(params: Period): Promise<number> {
    const allUsefulCharismaPeriod = await this.prisma.charismaPeriod.findMany({
      where: {
        AND: [
          {
            start: {
              gte: params.start,
            },
          },
          {
            end: {
              lte: params.end,
            },
          },
        ],
      },
      orderBy: {
        start: 'asc',
      },
    });
    console.log(allUsefulCharismaPeriod);
    return 0;
  }
}
