import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, VolunteerAvailability } from '@prisma/client';
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
    humanOverride = false,
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
    if (oldAvailabilities.length > 0 && !humanOverride) {
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
    let newCharismaPoints = 0;
    for (const period of newPeriods) {
      newCharismaPoints += await this.computeCharismaPoints(period);
    }
    let oldCharismaPoints = 0;
    for (const period of oldAvailabilities) {
      oldCharismaPoints += await this.computeCharismaPoints(period);
    }
    const charismaPoints = newCharismaPoints - oldCharismaPoints;
    console.log(charismaPoints);
    const userUpdate = this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        charisma: {
          increment: charismaPoints,
        },
      },
    });
    const volunteerAvailabilityUpdate =
      this.prisma.volunteerAvailability.createMany({
        data: newPeriods.map((period) => {
          return {
            start: period.start,
            end: period.end,
            userId,
          };
        }),
      });
    const volunteerAvailabilityDelete =
      this.prisma.volunteerAvailability.deleteMany({
        where: {
          userId,
        },
      });
    await this.prisma.$transaction(
      [volunteerAvailabilityDelete, userUpdate, volunteerAvailabilityUpdate],
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
    const availabilities = await this.prisma.volunteerAvailability.findMany({
      where: {
        userId,
      },
    });
    return {
      userId,
      periods: availabilities.map((av) => {
        return {
          start: av.start,
          end: av.end,
        };
      }),
    };
  }

  async findAll(): Promise<VolunteerAvailabilityResponseDto[]> {
    const allAvailabilities =
      await this.prisma.volunteerAvailability.findMany();
    //map group by user id and concat periods
    const formattedAvailabilities: VolunteerAvailabilityResponseDto[] = [];
    for (const availability of allAvailabilities) {
      const user = formattedAvailabilities.find(
        (el) => el.userId === availability.userId,
      );
      if (user) {
        user.periods.push({
          start: availability.start,
          end: availability.end,
        });
      } else {
        formattedAvailabilities.push({
          userId: availability.userId,
          periods: [
            {
              start: availability.start,
              end: availability.end,
            },
          ],
        });
      }
    }
    //map for each user as we want to return an array of objects
    return formattedAvailabilities;
  }

  async findUserAvailabilities(
    userId: number,
  ): Promise<VolunteerAvailabilityResponseDto> {
    const userAvailabilities = await this.prisma.volunteerAvailability.findMany(
      {
        where: {
          userId,
        },
      },
    );
    return {
      userId,
      periods: userAvailabilities.map((av) => {
        return {
          start: av.start,
          end: av.end,
        };
      }),
    };
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
    if (allUsefulCharismaPeriod.length > 0) {
      let totalCharismaPoints = 0;
      for (const period of allUsefulCharismaPeriod) {
        totalCharismaPoints += period.charisma;
      }
      return totalCharismaPoints;
    }
    return 0;
  }
}
