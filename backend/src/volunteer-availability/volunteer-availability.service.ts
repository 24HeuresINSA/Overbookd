import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { formatDateWithMinutes } from 'src/utils/date';
import { PrismaService } from '../prisma.service';
import {
  PeriodOrchestrator,
  PeriodWithError,
} from './domain/period-orchestrator';
import { Period } from './domain/period.model';
import { CreateVolunteerAvailabilityDto } from './dto/createVolunteerAvailability.dto';

type CharismaPeriod = Period & {
  charisma: number;
};

@Injectable()
export class VolunteerAvailabilityService {
  constructor(private prisma: PrismaService) {}

  async addAvailabilities(
    userId: number,
    { periods }: CreateVolunteerAvailabilityDto,
  ): Promise<Period[]> {
    const previousAvailabilityPeriods = await this.getAvailabilityPeriods(
      userId,
    );
    const periodOrchestrator = PeriodOrchestrator.init(
      previousAvailabilityPeriods,
    );
    periods.map((period) => periodOrchestrator.addPeriod(period));

    if (periodOrchestrator.errors.length > 0) {
      const errors = periodOrchestrator.errors
        .map(buildPeriodOrchestratorErrorMessage)
        .join('\n');
      throw new ForbiddenException(errors);
    }

    const updatedAvailabilityPeriods = periodOrchestrator.availabilityPeriods;

    const charismaDelta = await this.computeCharismaDelta(
      previousAvailabilityPeriods,
      updatedAvailabilityPeriods,
    );

    await this.updateVolunteer(
      userId,
      updatedAvailabilityPeriods,
      charismaDelta,
    );
    return this.getAvailabilityPeriods(userId);
  }

  async overrideAvailabilities(
    userId: number,
    periods: Period[],
  ): Promise<Period[]> {
    const periodOrchestrator = PeriodOrchestrator.init(periods);

    if (periodOrchestrator.errors.length > 0) {
      const errors = periodOrchestrator.errors
        .map(buildPeriodOrchestratorErrorMessage)
        .join('\n');
      throw new ForbiddenException(errors);
    }

    const previousAvailabilityPeriods = await this.getAvailabilityPeriods(
      userId,
    );

    const charismaDelta = await this.computeCharismaDelta(
      previousAvailabilityPeriods,
      periods,
    );

    await this.updateVolunteer(userId, periods, charismaDelta);
    return this.getAvailabilityPeriods(userId);
  }

  async findUserAvailabilities(userId: number): Promise<Period[]> {
    return this.getAvailabilityPeriods(userId);
  }

  private async updateVolunteer(
    userId: number,
    updatedAvailabilityPeriods: Period[],
    charismaDelta: number,
  ) {
    const deleteAvailabilities = this.deleteVolunteerAvailabilities(userId);
    const createAvailabilities = this.createAvailabilities(
      userId,
      updatedAvailabilityPeriods,
    );
    const updateVolunteerCharisma = this.updateVolunteerCharisma(
      userId,
      charismaDelta,
    );

    await this.prisma.$transaction(
      [deleteAvailabilities, updateVolunteerCharisma, createAvailabilities],
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  private createAvailabilities(
    userId: number,
    updatedAvailabilityPeriods: Period[],
  ) {
    return this.prisma.volunteerAvailability.createMany({
      data: updatedAvailabilityPeriods.map((period) => ({
        ...period,
        userId,
      })),
    });
  }

  private deleteVolunteerAvailabilities(userId: number) {
    return this.prisma.volunteerAvailability.deleteMany({
      where: { userId },
    });
  }

  private updateVolunteerCharisma(userId: number, charismaDelta: number) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      select: { id: true },
      data: {
        charisma: {
          increment: charismaDelta,
        },
      },
    });
  }

  private async computeCharismaDelta(
    previousAvailabilityPeriods: Period[],
    updatedAvailabilityPeriods: Period[],
  ) {
    const previousCharismas = await this.computeCharisma(
      previousAvailabilityPeriods,
    );
    const currentCharismas = await this.computeCharisma(
      updatedAvailabilityPeriods,
    );
    return previousCharismas - currentCharismas;
  }

  private async computeCharisma(
    updatedAvailabilityPeriods: Period[],
  ): Promise<number> {
    return (
      await Promise.all(
        updatedAvailabilityPeriods.map((period) =>
          this.computeCharismaPoints(period),
        ),
      )
    ).reduce((totalCharisma, charisma) => totalCharisma + charisma, 0);
  }

  private async getAvailabilityPeriods(userId: number): Promise<Period[]> {
    return await this.prisma.volunteerAvailability.findMany({
      where: {
        userId,
      },
      select: {
        start: true,
        end: true,
      },
    });
  }

  private async computeCharismaPoints(period: Period): Promise<number> {
    const allUsefulCharismaPeriod = await this.findUsefullCharismaPeriod(
      period,
    );
    // FIXME: this is not the right algorithm, we need to multiplie period duration with it corresponding charisma period charisma
    return allUsefulCharismaPeriod.reduce(
      (totalCharisma, charismaPeriod) =>
        totalCharisma + charismaPeriod.charisma,
      0,
    );
  }

  private async findUsefullCharismaPeriod({
    start,
    end,
  }: Period): Promise<CharismaPeriod[]> {
    return this.prisma.charismaPeriod.findMany({
      where: {
        AND: [
          {
            start: {
              gte: start,
            },
          },
          {
            end: {
              lte: end,
            },
          },
        ],
      },
      select: {
        charisma: true,
        start: true,
        end: true,
      },
      orderBy: {
        start: 'asc',
      },
    });
  }
}

function buildPeriodOrchestratorErrorMessage({
  start,
  end,
  message,
}: PeriodWithError): string {
  return `[${formatDateWithMinutes(start)}-${formatDateWithMinutes(
    end,
  )}]${message}`;
}
