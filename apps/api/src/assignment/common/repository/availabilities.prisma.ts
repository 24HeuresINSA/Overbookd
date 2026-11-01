import { Availabilities } from "@overbookd/assignment";
import { IProvidePeriod } from "@overbookd/time";
import { PrismaService } from "../../../prisma.service";
import { SELECT_PERIOD } from "../../../common/query/period.query";

export class PrismaAvailabilities implements Availabilities {
  constructor(private readonly prisma: PrismaService) {}

  async for(volunteer: number): Promise<IProvidePeriod[]> {
    return this.prisma.volunteerAvailability.findMany({
      where: { userId: volunteer },
      select: SELECT_PERIOD,
    });
  }
}
