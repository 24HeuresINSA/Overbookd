import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { formatDateWithMinutes } from 'src/utils/date';
import { PrismaService } from '../prisma.service';
import { ONE_HOUR_IN_MS } from '../utils/date';
import {
  PeriodOrchestrator,
  PeriodWithError,
} from './domain/period-orchestrator';
import { PeriodDto } from './dto/period.dto';

@Injectable()
export class VolunteerAvailabilityService {
  constructor(private prisma: PrismaService) {}

  async addAvailabilities(
    userId: number,
    periods: PeriodDto[],
  ): Promise<PeriodDto[]> {
    const previousAvailabilityPeriods = await this.findUserAvailabilities(
      userId,
    );
    const periodOrchestrator = PeriodOrchestrator.init(
      previousAvailabilityPeriods,
    );
    periods.map((period) => periodOrchestrator.addPeriod(period));

    this.checkPeriodsErrors(periodOrchestrator);

    const updatedAvailabilityPeriods = periodOrchestrator.availabilityPeriods;

    const charismaDelta = await this.computeCharismaDifference(
      previousAvailabilityPeriods,
      updatedAvailabilityPeriods,
    );

    await this.updateVolunteer(
      userId,
      updatedAvailabilityPeriods,
      charismaDelta,
    );
    return this.findUserAvailabilities(userId);
  }

  async findUserAvailabilities(userId: number): Promise<PeriodDto[]> {
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
    newPeriods: PeriodDto[],
  ): Promise<PeriodDto[]> {
    const previousAvailabilityPeriods = await this.findUserAvailabilities(
      userId,
    );
    const periodOrchestrator = PeriodOrchestrator.init();
    newPeriods.map((period) => periodOrchestrator.addPeriod(period));

    this.checkPeriodsErrors(periodOrchestrator);

    const updatedAvailabilityPeriods = periodOrchestrator.availabilityPeriods;

    const charismaDelta = await this.computeCharismaDifference(
      previousAvailabilityPeriods,
      updatedAvailabilityPeriods,
    );

    await this.updateVolunteer(
      userId,
      updatedAvailabilityPeriods,
      charismaDelta,
    );
    return this.findUserAvailabilities(userId);
  }

  private async computeCharismaPoints(params: PeriodDto): Promise<number> {
    //Get all charisma periods between start and end
    const allCharismaPeriods = await this.prisma.charismaPeriod.findMany({
      where: {
        start: {
          lte: params.end,
        },
        end: {
          gte: params.start,
        },
      },
      select: {
        start: true,
        end: true,
        charisma: true,
      },
    });
    return allCharismaPeriods.reduce((totalCharisma, charismaPeriod) => {
      const start = Math.max(
        charismaPeriod.start.getTime(),
        params.start.getTime(),
      );
      const end = Math.min(charismaPeriod.end.getTime(), params.end.getTime());
      const overlapDurationInHours = (end - start) / ONE_HOUR_IN_MS;
      return totalCharisma + overlapDurationInHours * charismaPeriod.charisma;
    }, 0);
  }

  private async computeCharismaDifference(
    oldPeriods: PeriodDto[],
    newPeriods: PeriodDto[],
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

  private async updateVolunteer(
    userId: number,
    updatedAvailabilityPeriods: PeriodDto[],
    charismaDelta: number,
  ) {
    const deleteAvailabilities = this.prisma.volunteerAvailability.deleteMany({
      where: { userId },
    });
    const createAvailabilities = this.prisma.volunteerAvailability.createMany({
      data: updatedAvailabilityPeriods.map((period) => ({
        start: period.start,
        end: period.end,
        userId,
      })),
    });
    const updateVolunteerCharisma = this.prisma.user.update({
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

    await this.prisma.$transaction(
      [deleteAvailabilities, updateVolunteerCharisma, createAvailabilities],
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  private checkPeriodsErrors(periodOrchestrator: PeriodOrchestrator): void {
    if (periodOrchestrator.errors.length > 0) {
      const errors = periodOrchestrator.errors
        .map(buildPeriodOrchestratorErrorMessage)
        .join('\n');
      throw new ForbiddenException(errors);
    }
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
