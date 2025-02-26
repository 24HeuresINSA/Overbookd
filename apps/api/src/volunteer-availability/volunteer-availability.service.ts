import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  Edition,
  IProvidePeriod,
  Period,
  formatDateWithMinutes,
} from "@overbookd/time";
import {
  PeriodOrchestrator,
  PeriodWithError,
} from "@overbookd/volunteer-availability";
import { PrismaService } from "../prisma.service";
import { SELECT_PERIOD } from "../common/query/period.query";
import { VOLUNTEER } from "@overbookd/registration";
import { DomainEventService } from "../domain-event/domain-event.service";
import { VOLUNTEER_BRIEFING_TIME_WINDOW_KEY } from "@overbookd/configuration";

@Injectable()
export class VolunteerAvailabilityService {
  constructor(
    private readonly eventStore: DomainEventService,
    private readonly prisma: PrismaService,
  ) {}

  private logger = new Logger("VolunteerAvailabilityService");

  onApplicationBootstrap() {
    this.eventStore.volunteersEnrolled.subscribe(
      async ({ data: enrolling }) => {
        this.logger.log("Adding briefing availabilities");
        this.logger.debug(JSON.stringify(enrolling));
        const briefing = await this.getBriefingTimeWindow();
        if (!briefing) {
          this.logger.error("Briefing time window not found");
          return;
        }
        this.addAvailabilities(enrolling.candidate.id, [briefing]);
      },
    );
  }

  async addAvailabilities(
    userId: number,
    periods: IProvidePeriod[],
  ): Promise<IProvidePeriod[]> {
    const previousAvailabilityPeriods =
      await this.findUserAvailabilities(userId);
    const periodOrchestrator = PeriodOrchestrator.init(
      previousAvailabilityPeriods,
    );
    const newPeriodsAdded = periodOrchestrator.areNewPeriodsAdded(periods);
    periods.map((period) => periodOrchestrator.addPeriod(Period.init(period)));

    this.checkPeriodsErrors(periodOrchestrator);

    const updatedAvailabilityPeriods = periodOrchestrator.availabilityPeriods;

    await this.updateVolunteer(
      userId,
      updatedAvailabilityPeriods,
      newPeriodsAdded,
    );
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
    resetApplicationRejection: boolean = false,
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
    const resetRejection = resetApplicationRejection
      ? [
          this.prisma.membershipApplication.updateMany({
            where: {
              userId,
              edition: Edition.current,
              membership: VOLUNTEER,
            },
            data: { isRejected: false },
          }),
        ]
      : [];

    await this.prisma.$transaction(
      [deleteAvailabilities, createAvailabilities, ...resetRejection],
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

  private async getBriefingTimeWindow(): Promise<IProvidePeriod | null> {
    const config = await this.prisma.configuration.findUnique({
      where: { key: VOLUNTEER_BRIEFING_TIME_WINDOW_KEY },
    });
    if (!config) return null;
    const { start, end } = config.value as unknown as IProvidePeriod;
    return { start: new Date(start), end: new Date(end) };
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
