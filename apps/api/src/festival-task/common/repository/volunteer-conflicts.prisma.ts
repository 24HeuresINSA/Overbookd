import {
  VolunteerConflicts,
  FestivalTask,
  Volunteer,
  Conflict,
} from "@overbookd/festival-event";
import { IProvidePeriod } from "@overbookd/period";
import { PrismaService } from "../../../prisma.service";

export class PrismaVolunteerConflicts implements VolunteerConflicts {
  constructor(private readonly prisma: PrismaService) {}

  async on(
    taskId: FestivalTask["id"],
    { start, end }: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<Conflict[]> {
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
}
