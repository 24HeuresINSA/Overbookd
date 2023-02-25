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
  ): Promise<VolunteerAvailabilityResponseDto> {
    const newPeriods = createVolunteerAvailability.periods;
    const oldAvailabilities = await this.prisma.volunteerAvailability.findMany({
      where: {
        userId,
      },
      select: {
        start: true,
        end: true,
      },
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
    let newCharismaPoints = 0;
    for (const period of newPeriods) {
      newCharismaPoints += await this.computeCharismaPoints(period);
    }
    let oldCharismaPoints = 0;
    for (const period of oldAvailabilities) {
      oldCharismaPoints += await this.computeCharismaPoints(period);
    }
    const charismaPoints = newCharismaPoints - oldCharismaPoints;
    const userUpdate = this.prisma.user.update({
      where: {
        id: userId,
      },
      select: {
        id: true,
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

  async findUserAvailabilities(
    userId: number,
  ): Promise<VolunteerAvailabilityResponseDto> {
    const userAvailabilities = await this.prisma.volunteerAvailability.findMany(
      {
        where: {
          userId,
        },
        select: {
          start: true,
          end: true,
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

  async addAvailabilitiesWithoutCheck(
    userId: number,
    createVolunteerAvailability: CreateVolunteerAvailabilityDto,
  ): Promise<void> {
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
    let newCharismaPoints = 0;
    for (const period of newPeriods) {
      newCharismaPoints += await this.computeCharismaPoints(period);
    }
    let oldCharismaPoints = 0;
    for (const period of oldAvailabilities) {
      oldCharismaPoints += await this.computeCharismaPoints(period);
    }
    const charismaPoints = newCharismaPoints - oldCharismaPoints;
    const userUpdate = this.prisma.user.update({
      where: {
        id: userId,
      },
      select: {
        id: true,
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
