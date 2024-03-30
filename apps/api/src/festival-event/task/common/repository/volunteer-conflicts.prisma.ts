import {
  VolunteerConflicts,
  FestivalTask,
  Volunteer,
  FestivalTaskLink,
  Conflicts,
} from "@overbookd/festival-event";
import { IProvidePeriod } from "@overbookd/period";
import { READY_TO_ASSIGN } from "@overbookd/status";
import { PrismaService } from "../../../../prisma.service";

export class PrismaVolunteerConflicts implements VolunteerConflicts {
  constructor(private readonly prisma: PrismaService) {}

  async on(
    taskId: FestivalTask["id"],
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<Conflicts> {
    const tasks = await this.onTask(taskId, period, volunteerId);
    const availability = await this.onAvailability(period, volunteerId);
    const assignments = await this.onAssignments(taskId, period, volunteerId);
    return { tasks, availability, assignments };
  }

  private async onTask(
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
        NOT: [
          { ft: { id: taskId }, start, end },
          { ft: { status: READY_TO_ASSIGN } },
        ],
      },
      select: {
        ft: { select: { id: true, name: true } },
      },
    });
    return conflicts.map(({ ft }) => ft);
  }

  private async onAvailability(
    { start, end }: IProvidePeriod,
    userId: Volunteer["id"],
  ): Promise<boolean> {
    const availabilities = await this.prisma.volunteerAvailability.count({
      where: {
        userId,
        start: { lte: start },
        end: { gte: end },
      },
    });
    return availabilities === 0;
  }

  private async onAssignments(
    taskId: FestivalTask["id"],
    { start, end }: IProvidePeriod,
    userId: Volunteer["id"],
  ): Promise<FestivalTaskLink[]> {
    const conflicts = await this.prisma.assignment.findMany({
      where: {
        festivalTask: { isDeleted: false },
        start: { lt: end },
        end: { gt: start },
        assignees: { some: { userId } },
        NOT: { festivalTask: { id: taskId } },
      },
      select: {
        festivalTask: { select: { id: true, name: true } },
      },
    });
    return conflicts.map(({ festivalTask }) => festivalTask);
  }
}
