import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Period } from './dto/createVolunteerAvailability.dto';

@Injectable()
export class VolunteerAvailabilityService {
  constructor(private prisma: PrismaService) {}

  async addAvailabilities(
    userId: number,
    newPeriods: Period[],
  ): Promise<Period[]> {
    const oldPeriods = await this.prisma.volunteerAvailability.findMany({
      where: {
        userId,
      },
      select: {
        start: true,
        end: true,
      },
    });
    if (oldPeriods.length > 0) {
      this.computePeriodDifference(oldPeriods, newPeriods);
    }
    const charismaPoints = await this.computeCharismaDifference(
      oldPeriods,
      newPeriods,
    );
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
      select: {
        start: true,
        end: true,
      },
    });
    return availabilities;
  }

  async findUserAvailabilities(userId: number): Promise<Period[]> {
    return this.prisma.volunteerAvailability.findMany({
      where: {
        userId,
      },
      select: {
        start: true,
        end: true,
      },
    });
  }

  async addAvailabilitiesWithoutCheck(
    userId: number,
    newPeriods: Period[],
  ): Promise<void> {
    const oldPeriods = await this.prisma.volunteerAvailability.findMany({
      where: {
        userId,
      },
      select: {
        start: true,
        end: true,
      },
    });
    const charismaPoints = await this.computeCharismaDifference(
      oldPeriods,
      newPeriods,
    );
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

  private getPeriodDuration({ start, end }: Period): number {
    return Math.floor(new Date(end).getTime() - new Date(start).getTime());
  }

  private computePeriodDifference(
    oldPeriods: Period[],
    newPeriods: Period[],
  ): void {
    const oldAvailabilitiesDuration = oldPeriods.reduce(
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
    return allUsefulCharismaPeriod.reduce(
      (charisma, period) => charisma + period.charisma,
      0,
    );
  }

  private async computeCharismaDifference(
    oldPeriods: Period[],
    newPeriods: Period[],
  ): Promise<number> {
    let newCharismaPoints = 0;
    for (const period of newPeriods) {
      newCharismaPoints += await this.computeCharismaPoints(period);
    }
    let oldCharismaPoints = 0;
    for (const period of oldPeriods) {
      oldCharismaPoints += await this.computeCharismaPoints(period);
    }
    return newCharismaPoints - oldCharismaPoints;
  }
}
