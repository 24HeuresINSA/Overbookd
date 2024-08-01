import { ForbiddenException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { IProvidePeriod, Period } from "@overbookd/period";
import {
  PeriodOrchestrator,
  PeriodWithError,
} from "@overbookd/volunteer-availability";
import { PrismaService } from "../prisma.service";
import { formatDateWithMinutes } from "@overbookd/date";
import { SELECT_PERIOD } from "../common/query/period.query";

@Injectable()
export class VolunteerAvailabilityService {
  constructor(private prisma: PrismaService) {}

  async addAvailabilities(
    userId: number,
    periods: IProvidePeriod[],
  ): Promise<IProvidePeriod[]> {
    const previousAvailabilityPeriods =
      await this.findUserAvailabilities(userId);
    const periodOrchestrator = PeriodOrchestrator.init(
      previousAvailabilityPeriods,
    );
    periods.map((period) => periodOrchestrator.addPeriod(Period.init(period)));

    this.checkPeriodsErrors(periodOrchestrator);

    const updatedAvailabilityPeriods = periodOrchestrator.availabilityPeriods;

    await this.updateVolunteer(userId, updatedAvailabilityPeriods);
    return this.findUserAvailabilities(userId);
  }

  async findUserAvailabilities(userId: number): Promise<IProvidePeriod[]> {
    return this.prisma.volunteerAvailability.findMany({
      where: { userId },
      select: SELECT_PERIOD,
    });
  }

  async addAvailabilitiesWithoutCheck(
    userId: number,
    newPeriods: IProvidePeriod[],
  ): Promise<IProvidePeriod[]> {
    const periodOrchestrator = PeriodOrchestrator.init();
    newPeriods.map((period) =>
      periodOrchestrator.addPeriod(Period.init(period)),
    );

    this.checkPeriodsErrors(periodOrchestrator);

    const updatedAvailabilityPeriods = periodOrchestrator.availabilityPeriods;

    await this.updateVolunteer(userId, updatedAvailabilityPeriods);
    return this.findUserAvailabilities(userId);
  }

  private async updateVolunteer(
    userId: number,
    updatedAvailabilityPeriods: IProvidePeriod[],
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

    await this.prisma.$transaction(
      [deleteAvailabilities, createAvailabilities],
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  private checkPeriodsErrors(periodOrchestrator: PeriodOrchestrator): void {
    if (periodOrchestrator.errors.length > 0) {
      const errors = periodOrchestrator.errors
        .map(buildPeriodOrchestratorErrorMessage)
        .join("\n");
      throw new ForbiddenException(errors);
    }
  }
}

function buildPeriodOrchestratorErrorMessage({
  start,
  end,
  message,
}: PeriodWithError): string {
  const startString = formatDateWithMinutes(start);
  const endString = formatDateWithMinutes(end);
  return `[${startString}-${endString}]${message}`;
}
