import {
  VolunteerConflicts,
  FestivalTask,
  Volunteer,
  FestivalTaskLink,
  Conflicts,
} from "@overbookd/festival-event";
import { IProvidePeriod } from "@overbookd/period";
import { PrismaService } from "../../../prisma.service";

export class PrismaVolunteerConflicts implements VolunteerConflicts {
  constructor(private readonly prisma: PrismaService) {}

  async on(
    taskId: FestivalTask["id"],
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<Conflicts> {
    const tasks = await this.onTask(taskId, period, volunteerId);
    const isAvailable = await this.isAvailable(period, volunteerId);
    return { tasks, isAvailable };
  }

  async onTask(
    taskId: FestivalTask["id"],
    { start, end }: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<FestivalTaskLink[]> {
    const conflicts = await this.prisma.festivalTaskMobilization.findMany({
      where: {
        ft: { isDeleted: false },
        start: { lt: end },
        end: { gt: start },
        volunteers: { some: { volunteerId } },
        NOT: { ft: { id: taskId }, start, end },
      },
      select: {
        ft: { select: { id: true, name: true } },
      },
    });
    return conflicts.map(({ ft }) => ft);
  }

  async isAvailable(
    { start, end }: IProvidePeriod,
    userId: Volunteer["id"],
  ): Promise<boolean> {
    const availabilities = await this.prisma.volunteerAvailability.findMany({
      where: {
        userId,
        start: { lte: start },
        end: { gte: end },
      },
    });
    return availabilities.length > 0;
  }
}
